// ログインフォームが記述された部品をインポートする
import { Login } from "@/components/api/auth/login/Login";

/**
 * ログインページコンポーネント
 * * Next.jsのルーティング(例: /login)に対応するページ全体のレイアウトを定義する
 */
export default function LoginPage() {
  return (
    /**
     * mainタグ: ページのメインコンテンツであることをブラウザや検索エンジンに伝える
     * * 【Tailwind CSSの解説】
     * - container: 画面幅に応じてコンテンツの最大幅を制限する
     * - mx-auto: 左右の余白を自動調整し、コンテンツを中央に寄せにする
     * - px-4: 左右に適切なパディング(内側の余白)を設け、スマホ表示などで文字が端に張り付くのを防ぐ
     */
    <main className="container mx-auto px-4">
      {/* 自作したログインフォーム部品を呼び出す */}
      <Login />
    </main>
  );
}