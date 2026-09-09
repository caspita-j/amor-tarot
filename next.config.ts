import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async headers() {
    return [
      {
        // Protecciones estándar del navegador (09-SEGURIDAD.md) — ninguna
        // cambia comportamiento, solo cierran puertas que no se usan:
        // que el sitio no se pueda incrustar en un iframe ajeno (clickjacking),
        // que el navegador no adivine el tipo de un archivo (MIME sniffing),
        // y que no se filtre la URL completa al navegar a otro sitio.
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
