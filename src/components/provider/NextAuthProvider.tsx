/**
 * "use client"はクライアントサイドで実行されることを明示する
 * Next.jsのApp Router環境において、NextAuthのSessionProviderのように
 * 状態(State)やコンテキストを持つ機能を使うためには必須の宣言
 */
"use client";

// NextAuthが提供する、セッション情報をアプリ全体に配るためのコンポーネントを読み込む
import { SessionProvider } from "next-auth/react";

/**
 * 認証情報プロバイダーコンポーネント
 * アプリケーションの画面（children）全体をこのコンポーネントで包み込むことで、
 * どの画面・どのコンポーネントからでも「今ログインしているユーザーの情報」を
 * 簡単に取り出せる（useSession等が使える)ようになる
 * * @param children - このプロバイダーで包み込む対象のUI(通常はアプリケーション全体)
 */
export const NextAuthProvider = ({ children }: { children: React.ReactNode }) => {
  // SessionProviderでアプリケーション全体(children)をラップして返す
  return <SessionProvider>{children}</SessionProvider>;
};