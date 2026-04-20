// テスト時にtoBeInTheDocument()などの便利なカスタムマッチャーを使えるようにする
import '@testing-library/jest-dom'
// JSDOM環境に不足している PointerEvent 関連のAPIを擬似的にモックする
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.hasPointerCapture = () => false;
  window.HTMLElement.prototype.setPointerCapture = () => {};
  window.HTMLElement.prototype.releasePointerCapture = () => {};
}