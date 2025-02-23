import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver, AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/variables.scss" as *;
          @use "@/utils/helpers.sass" as *;
        `
      }
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver(), AntDesignVueResolver()],
      dts: 'src/auto-imports.d.ts'
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        AntDesignVueResolver({
          importStyle: false, // css in js
          resolveIcons: true, // 自动导入图标
          cjs: false
        })
      ],
      include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/, /ant-design-vue\/.*\/.*/],
      // 生成类型声明文件
      dts: 'src/components.d.ts'
    })
  ],
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
        target: 'https://ceshi.doufapt.com', // 正式地址
        // target: 'http://test.doufapt.com', // 测试地址
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
