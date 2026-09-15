#!/usr/bin/env bash
# PostToolUse hook (Edit|Write) — linter mecánico de diseño sobre EL ARCHIVO editado.
# Detecta las huellas del diseño genérico en el momento en que se escriben
# (complementa scripts/audit-diseno.sh, que audita el proyecto entero).
# Robusto: sin Node o sin file_path -> exit 0 silencioso.

INPUT=$(cat)

command -v node >/dev/null 2>&1 || exit 0
FILE_PATH=$(printf '%s' "$INPUT" | node -e '
let input = "";
process.stdin.on("data", chunk => input += chunk);
process.stdin.on("end", () => {
  try { process.stdout.write(JSON.parse(input)?.tool_input?.file_path ?? ""); } catch {}
});
' 2>/dev/null)

[ -z "$FILE_PATH" ] && exit 0
[ -f "$FILE_PATH" ] || exit 0

# Solo archivos de UI.
case "$FILE_PATH" in
  *.tsx|*.jsx|*.css) ;;
  *) exit 0 ;;
esac

# Archivos donde los hex y fuentes SÍ son legítimos (tokens/config/tema).
BASENAME=$(basename "$FILE_PATH")
case "$BASENAME" in
  globals.css|tailwind.config.*|theme*|tokens*|*design*|fonts*) exit 0 ;;
esac

FINDINGS=""

# 1. Hex hardcodeado fuera de tokens (regla 17 de UX — todo color es token).
HEX=$(grep -nE '#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b' "$FILE_PATH" 2>/dev/null | grep -v 'currentColor' | head -5)
[ -n "$HEX" ] && FINDINGS="$FINDINGS
❌ Hex directo fuera de tokens (usa var(--...) o clases de tokens — archivo 10):
$HEX"

# 2. transition: all (prohibido — DESIGN-CORE §2).
TALL=$(grep -nE 'transition:\s*all|transition-all' "$FILE_PATH" 2>/dev/null | head -3)
[ -n "$TALL" ] && FINDINGS="$FINDINGS
❌ 'transition: all' / transition-all (anima propiedades explícitas: transform/opacity/color):
$TALL"

# 3. Fuentes prohibidas como marca (huella del diseño genérico).
FONTS=$(grep -nE "font-family[^;]*(Inter|Roboto|system-ui)|['\"](Inter|Roboto)['\"]" "$FILE_PATH" 2>/dev/null | head -3)
[ -n "$FONTS" ] && FINDINGS="$FINDINGS
❌ Inter/Roboto/system-ui como fuente (usa las fuentes de FICHA-ARTE.md — 16/29):
$FONTS"

# 4. min-h-full en shells (produce el vacío muerto bajo la nav — Regla de Oro 7).
MHF=$(grep -nE 'min-h-full' "$FILE_PATH" 2>/dev/null | head -3)
[ -n "$MHF" ] && FINDINGS="$FINDINGS
❌ min-h-full (el shell de pantalla usa min-h-dvh — archivo 32):
$MHF"

# 5. ESPACIADO arbitrario fuera de la escala 4·8·12·16·24·32·48·64 (archivo 14).
#    ALCANCE (corregido 2026-09-15): la escala del 14 es de ESPACIADO — padding, margin,
#    gap. Antes el patrón era `[a-z]+-[Npx]`, que barría TODA utilidad con valor en px y
#    contradecía las otras reglas del propio SO: marcaba text-[14px] (el mínimo de cuerpo
#    que exige UX 5), text-[40px]/text-[60px] (rango display de la fórmula de jerarquía),
#    text-[12px] (labels 11-13px, nivel N4) y anchos de medida como max-w-[1140px] o
#    w-[250px], que no viven en una escala de 8. Resultado: bloqueaba ediciones legítimas
#    del kit ya certificado y empujaba a romper la tipografía aprobada para callar al linter.
#    Ahora mira SOLO utilidades de espaciado; ahí sigue siendo estricto valor por valor
#    (una línea con p-[16px] Y p-[17px] se marca igual).
ARB=$(awk '{ rest = $0; bad = 0
             while (match(rest, /(^|[^A-Za-z0-9_-])-?(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y)-\[[0-9]+px\]/)) {
               s = RSTART; l = RLENGTH
               tok = substr(rest, s, l)
               if (match(tok, /\[[0-9]+px\]/)) {
                 v = substr(tok, RSTART, RLENGTH)
                 if (v !~ /^\[(4|8|12|16|24|32|48|64)px\]$/) bad = 1 }
               rest = substr(rest, s + l) }
             if (bad) print FNR ":" $0 }' "$FILE_PATH" 2>/dev/null | head -5)
[ -n "$ARB" ] && FINDINGS="$FINDINGS
⚠️ Valores arbitrarios fuera de la escala 4·8·12·16·24·32·48·64 (archivo 14):
$ARB"

if [ -n "$FINDINGS" ]; then
  {
    echo "🎨 LINTER DE DISEÑO — huellas de diseño genérico en $BASENAME:"
    echo "$FINDINGS"
    echo ""
    echo "Corrige AHORA (causa raíz, no supresión). Los valores válidos viven en FICHA-ARTE.md y globals.css."
  } >&2
  exit 2
fi

exit 0
