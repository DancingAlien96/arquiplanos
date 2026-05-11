import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permite imágenes servidas desde el folder public/uploads/
    // No se necesita configuración de dominio para rutas locales (/uploads/...)
    unoptimized: false,
  },
};

export default nextConfig;
