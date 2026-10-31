import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RADIO HORIZONTES FM 91.3 · AM 1440 | La radio de los artistas",
  description: "Escucha Radio Horizontes FM 91.3 y AM 1440 en vivo. Mira Horizontes TV, consulta el clima de Sucre y mantente conectado. La radio de los artistas.",
  applicationName: "Radio Horizontes FM 91.3",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
