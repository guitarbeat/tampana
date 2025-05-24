import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import deadFile from 'vite-plugin-deadfile'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    deadFile({
      root: 'src',
      output: 'dead-files.txt',
      throwWhenFound: false
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