import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import deadFile from 'vite-plugin-deadfile'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    deadFile({
      root: 'src',
      output: 'dead-files.txt',
      throwWhenFound: false
    }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Tampana',
        short_name: 'Tampana',
        description: 'Emotion tagging application',
        theme_color: '#111111',
        background_color: '#111111',
        display: 'standalone',
        icons: [
          { src: '/vite.svg', sizes: 'any', type: 'image/svg+xml' }
        ]
      },
      workbox: {
        navigateFallbackDenylist: [/^\/api\//]
      }
    })
  ],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    hmr: {
      host: 'localhost'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // Remove: root: 'src',
  // Remove: publicDir: '../public',
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: true,
    // Remove the custom rollupOptions.input
  }
})