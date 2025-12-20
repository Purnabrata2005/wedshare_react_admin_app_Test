import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Redux ecosystem
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux', 'redux-saga'],
          // UI libraries
          'vendor-radix': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-avatar',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-slot',
          ],
          // Icons
          'vendor-icons': ['@tabler/icons-react', 'lucide-react'],
          // Utilities
          'vendor-utils': ['axios', 'clsx', 'tailwind-merge', 'class-variance-authority', 'uuid'],
          // Animation
          'vendor-motion': ['motion'],
          // Forms & storage
          'vendor-forms': ['react-hook-form', 'dexie', 'browser-image-compression'],
        },
      },
    },
  },
})
