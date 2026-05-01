import Calc from "@/components/calc/Calc";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  // サーバーサイドで現在のセッション（ログイン状態）を取得
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-zinc-50">
      
      {/* ログイン状態の確認エリア */}
      <div className="w-full max-w-2xl mb-8 p-4 bg-white rounded-lg shadow-sm border text-center">
        {session ? (
          // セッションが存在すれば「ログイン中」と表示
          <div className="flex flex-col items-center gap-2">
            <p className="text-green-600 font-bold">● ログイン中（認証済み）</p>
            {/* ログアウト機能は未実装なので、確認用にログイン画面へのリンク等があってもOK */}
          </div>
        ) : (
          // セッションがなければ「未ログイン」と表示
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-400">未ログイン状態です</p>
            <Link href="/login" className="text-blue-500 hover:underline font-medium">
              ログイン画面へ
            </Link>
          </div>
        )}
      </div>

      {/* メインコンテンツ（計算機） */}
      <Calc />
    </main>
  );
}