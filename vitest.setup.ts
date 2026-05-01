// テスト時にtoBeInTheDocument()などの便利なカスタムマッチャーを使えるようにする
import '@testing-library/jest-dom'
// JSDOM環境に不足している PointerEvent 関連のAPIを擬似的にモックする
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.hasPointerCapture = () => false;
  window.HTMLElement.prototype.setPointerCapture = () => {};
  window.HTMLElement.prototype.releasePointerCapture = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
}

// --- 【ここから追加】MSW (Mock Service Worker) の設定 ---
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './src/mocks/server'

// 1. 全てのテストが始まる前に、MSWサーバーを起動する
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// 2. 各テストが終わるたびに、モック（ハンドラー）の状態をリセットする
// これにより、あるテストで行った設定変更が他のテストに影響しないようにする
afterEach(() => server.resetHandlers())

// 3. 全てのテストが完了したら、MSWサーバーを停止して後片付けをする
afterAll(() => server.close())