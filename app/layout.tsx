import type { Metadata } from "next";
import { Baloo_2, Cormorant_Garamond, Mulish } from "next/font/google";
import "./globals.css";

const baloo2 = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Solo para el "tema místico" (fondo oscuro/dorado de la app por dentro,
// ver components/app/TemaMistico.tsx) — Baloo 2 es redonda/infantil y no
// combina con esa dirección. Se carga acá (una vez, global) para que
// next/font la optimice, pero solo se USA dentro del tema místico.
const cormorant = Cormorant_Garamond({
  variable: "--font-mistico",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Amor & Tarot — la verdad de tu situación, en 3 cartas",
  description:
    "Cuéntale tu situación con tus propias palabras y recibe una lectura que la cita literalmente. Sin anuncios, sin cobros ocultos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${baloo2.variable} ${mulish.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
