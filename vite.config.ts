
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
const { version } = require('./package.json')

const projectRoot = __dirname

// ✅ 根据环境设置 base：开发用 '/', 生产用 '/<repo>/'
const REPO_NAME = 'Podcast-Wandering' // ← 修改为你的仓库名
const BASE_PATH = process.env.NODE_ENV === 'production' ? `/${REPO_NAME}/` : '/'

export default defineConfig(() => {
  return {
    // ✅ 关键：为 GitHub Pages 设置 base
    base: BASE_PATH,

    plugins: [
      vue(),
      // 仅本地开发下有意义；在 GH Pages 上不会走 https 开发证书
      mkcert(),

      // ✅ 建议在部署 PWA 时提供 manifest，并确保 start_url/scope 与 base 对齐
      VitePWA({
        registerType: 'autoUpdate',
        // ⚠️ 原先 manifest: false 改为提供一个显式 manifest
        manifest: {
          name: 'My Vue App',
          short_name: 'VueApp',
          description: 'A Vue app deployed to GitHub Pages',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',

          // ✅ 与 base 对齐（GH Pages 子路径）
          start_url: `${BASE_PATH}?source=pwa`,
          scope: BASE_PATH,

          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module'
        },
        includeAssets: [
          'apple-touch-icon.png',
          'favicon-32x32.png',
          'favicon-16x16.png',
          'safari-pinned-tab.svg'
        ],
        // 可选：在 GH Pages 子路径下，建议显式设置 workbox 的导航回退
        workbox: {
          navigateFallback: `${BASE_PATH}index.html`,
        }
      })
    ],

    server: {
      host: '0.0.0.0'
    },

    resolve: {
      alias: {
        '@': resolve(projectRoot, 'src'),
      }
    },

    define: {
      PT_ENV: {
        version,
        client: 'web'
      }
    }
  }
})
