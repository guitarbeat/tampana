import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import deadFile from 'vite-plugin-deadfile'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    deadFile({
      root: 'src',
      output: 'dead-files.txt',
      throwWhenFound: false
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/',
        navigateFallbackDenylist: [/^\/api\//, /\.html$/]
      },
      manifest: {
        name: 'Tampana - Emotional Wellness Tracker',
        short_name: 'Tampana',
        description: 'Track and analyze emotional patterns with intelligent insights',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icon-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
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
    sourcemap: false, // Disable sourcemaps in production for better performance
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          vue: ['vue-cal'],
          utils: ['date-fns', 'uuid', 'axios'],
          styled: ['styled-components']
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000,
    target: 'es2015',
    cssCodeSplit: true,
    reportCompressedSize: false
  }
})