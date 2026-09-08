'use client';

// template.tsx (a diferencia de layout.tsx) remonta en cada navegación —
// es el gancho correcto de Next.js App Router para animar el cambio entre
// tabs del BottomNav (Inicio/Lecturas/Historial/Perfil), que antes era un
// corte seco.

import { motion, useReducedMotion } from 'motion/react';

export default function AppTemplate({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
