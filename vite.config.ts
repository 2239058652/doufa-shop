import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig({
  // optimizeDeps: {
  //   include: ['default-passive-events']
  // },
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // open: true,  // 自动打开浏览器
    port: 5468,
    hmr: {
      overlay: false
    },
    host: '0.0.0.0',
    proxy: {
      '/api': {
        // target: 'https://ceshi.doufapt.com',    // 正式地址
        target: 'http://test.doufapt.com', // 测试地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    // 分包策略
    rollupOptions: {
      output: {
        manualChunks: {}
      }
    },
    chunkSizeWarningLimit: 4096,
    minify: 'terser',
    outDir: 'dist',
    sourcemap: false,
    cssCodeSplit: true,
    terserOptions: {
      compress: {
        drop_debugger: true,
        drop_console: true
      }
    }
  }
})
