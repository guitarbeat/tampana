// vite.config.ts
import { defineConfig } from "file:///Users/aaron/Desktop/Side-Quests/manus/tampana_v2_core/node_modules/vite/dist/node/index.js";
import react from "file:///Users/aaron/Desktop/Side-Quests/manus/tampana_v2_core/node_modules/@vitejs/plugin-react/dist/index.mjs";
import deadFile from "file:///Users/aaron/Desktop/Side-Quests/manus/tampana_v2_core/node_modules/vite-plugin-deadfile/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "/Users/aaron/Desktop/Side-Quests/manus/tampana_v2_core";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    deadFile({
      root: "src",
      output: "dead-files.txt",
      throwWhenFound: false
    })
  ],
  server: {
    host: true,
    port: 3e3,
    strictPort: true,
    hmr: {
      host: "localhost"
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  // Remove: root: 'src',
  // Remove: publicDir: '../public',
  build: {
    outDir: path.resolve(__vite_injected_original_dirname, "dist"),
    emptyOutDir: true,
    sourcemap: true
    // Remove the custom rollupOptions.input
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYWFyb24vRGVza3RvcC9TaWRlLVF1ZXN0cy9tYW51cy90YW1wYW5hX3YyX2NvcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9hYXJvbi9EZXNrdG9wL1NpZGUtUXVlc3RzL21hbnVzL3RhbXBhbmFfdjJfY29yZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYWFyb24vRGVza3RvcC9TaWRlLVF1ZXN0cy9tYW51cy90YW1wYW5hX3YyX2NvcmUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IGRlYWRGaWxlIGZyb20gJ3ZpdGUtcGx1Z2luLWRlYWRmaWxlJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgZGVhZEZpbGUoe1xuICAgICAgcm9vdDogJ3NyYycsXG4gICAgICBvdXRwdXQ6ICdkZWFkLWZpbGVzLnR4dCcsXG4gICAgICB0aHJvd1doZW5Gb3VuZDogZmFsc2VcbiAgICB9KVxuICBdLFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiB0cnVlLFxuICAgIHBvcnQ6IDMwMDAsXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICBobXI6IHtcbiAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnXG4gICAgfVxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJylcbiAgICB9XG4gIH0sXG4gIC8vIFJlbW92ZTogcm9vdDogJ3NyYycsXG4gIC8vIFJlbW92ZTogcHVibGljRGlyOiAnLi4vcHVibGljJyxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdkaXN0JyksXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICAgIC8vIFJlbW92ZSB0aGUgY3VzdG9tIHJvbGx1cE9wdGlvbnMuaW5wdXRcbiAgfVxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQW9WLFNBQVMsb0JBQW9CO0FBQ2pYLE9BQU8sV0FBVztBQUNsQixPQUFPLGNBQWM7QUFDckIsT0FBTyxVQUFVO0FBSGpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLGdCQUFnQjtBQUFBLElBQ2xCLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixLQUFLO0FBQUEsTUFDSCxNQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUEsRUFHQSxPQUFPO0FBQUEsSUFDTCxRQUFRLEtBQUssUUFBUSxrQ0FBVyxNQUFNO0FBQUEsSUFDdEMsYUFBYTtBQUFBLElBQ2IsV0FBVztBQUFBO0FBQUEsRUFFYjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
