import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),tailwindcss(),

    VitePWA({
      // registerType: 'prompt',
      registerType: "autoUpdate",
      injectRegister: false,
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "masked-icon.svg",
        "offline.html", // fallback page
      ],

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "Sunshine Logistic Service",
        short_name: "courier-track",
        description: "Track and manage couriers delieveries easily ",
        theme_color: "#ffffff",
        // theme_color: '#0d6efd',
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,

         runtimeCaching: [
          // 🟢 Dynamic API (NetworkFirst)
          {
            urlPattern: /^https:\/\/api\.mycourierapp\.com\/tracking\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tracking-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60, // 1 hour
              },
            },
          },
          // 🟢 Static assets (CacheFirst)
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },

      devOptions: {
        enabled: true, // allow testing service worker in dev mode
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
