/**
 * このファイルはブラウザ側(クライアントサイド)で実行されることを明示する
 * useState(入力値の保持)やイベントハンドラ(ボタンクリック時の処理)など、
 * ユーザーの操作に反応する動的な機能を使うために必須の宣言
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// NextAuthが提供するログイン処理用の関数を読み込む
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * ログインフォームコンポーネント
 * ユーザーが入力したIDとパスワードを受け取り、NextAuthに渡して認証を行う
 */
export const Login = () => {
  // 画面遷移(リダイレクト)を制御するためのルーターを取得する
  const router = useRouter();

  // 【State(状態)の定義】
  // 画面の入力値や現在の状態を保持し、変化があれば自動で画面を再描画(レンダリング)する
  const [username, setUsername] = useState("");     // 入力されたユーザー名/Email
  const [password, setPassword] = useState("");     // 入力されたパスワード
  const [errorMessage, setErrorMessage] = useState(""); // エラー発生時のメッセージ
  const [isLoading, setIsLoading] = useState(false);  // 通信中かどうかの判定(ボタン連打防止用)

  /**
   * フォーム送信(ログインボタン押下)時の処理
   */
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // フォーム送信時のブラウザ標準機能(画面の全体リロード)をキャンセルする
    // これにより、Reactが裏側で非同期に通信を行えるようになります。
    e.preventDefault();
    
    // 通信を開始するので、ローディング状態をONにし、前回の古いエラーメッセージを消去する
    setIsLoading(true);    
    setErrorMessage(""); 

    // 【NextAuthの呼び出し】
    // lib/auth.tsで定義した'credentials'プロバイダーを呼び出す
    const res = await signIn("credentials", {
      usernameOrEmail: username, // 入力されたID
      password: password,        // 入力されたパスワード
      redirect: false,           // 失敗時に勝手に別のエラー画面に飛ばされないよう、自動リダイレクトを無効化
      callbackUrl: "/",          // 成功時に向かう予定のURL
    });

    // 【通信結果に応じた分岐】
    if (res?.error) {
      // 失敗時：lib/auth.tsからthrowされたエラーメッセージを受け取り、画面に表示する
      setErrorMessage(res.error);
      setIsLoading(false); // 通信が終わったのでローディング状態を解除する
    } else if (res?.ok) {
      // 成功時：トップページ（/）へ画面遷移し、画面の情報を最新状態に更新する
      router.push("/");
      router.refresh(); 
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow-sm border border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center border-b pb-4">
        ログイン
      </h2>

      {/* 【エラーメッセージの表示エリア】
          errorMessageに文字が入っている時だけ、この赤い警告ボックスが表示される
          テスト(Vitest)からエラーが正しく表示されたかを確認しやすくするためdata-testidを付加 */}
      {errorMessage && (
        <div data-testid="error-message" className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center font-medium">
          {errorMessage}
        </div>
      )}

      {/* フォーム全体を onSubmit={handleSubmit} で囲むことで、
          エンターキーを押した時や送信ボタンを押した時にhandleSubmitを実行する */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* ユーザー名入力欄 */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            ユーザー名またはメールアドレス
          </label>
          <Input 
            type="text" 
            data-testid="input-username" // テスト用の目印
            value={username} 
            // 文字が入力されるたびに、State(username)の内容を最新の入力値に書き換える
            onChange={(e) => setUsername(e.target.value)} 
            autoComplete="one-time-code"
            placeholder="xxxxx"
            required
          />
        </div>

        {/* パスワード入力欄 */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            パスワード
          </label>
          <Input 
            type="password" 
            data-testid="input-password" // テスト用の目印
            value={password} 
            // パスワードのStateを更新する
            onChange={(e) => setPassword(e.target.value)} 
            autoComplete="one-time-code"
            placeholder="••••••••"
            required
          />
        </div>

        {/* 送信ボタン 
            通信中(isLoadingがtrue)、またはID・パスワードが空の場合はボタンを押せない(disabled)ように制御する */}
        <Button type="submit" data-testid="submit-button" disabled={isLoading || !username || !password} className="w-full mt-2">
          {isLoading ? "ログイン中..." : "ログイン"}
        </Button>
      </form>
    </div>
  );
};