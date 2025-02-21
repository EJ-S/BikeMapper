import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Ensures the PWA updates automatically
      devOptions: {
        enabled: true, // Enables debugging in development
      },
      manifest: {
        name: "Bike Mapper",
        short_name: "Bike Map",
        description: "Making Biking Safer Everywhere",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/bicycle.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/bicycle.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
