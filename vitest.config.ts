import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Node.js上でブラウザのDOMをシミュレートする
    setupFiles: ['./vitest.setup.ts'], // テスト実行前に読み込む設定ファイル
    globals: true,
    // デフォルトの除外リストに 'tests/**' (Playwright用フォルダ) を追加します
    exclude: [...configDefaults.exclude, 'tests/**'],  
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // @/components などのパスエイリアスを解決する
    },
  },
})