import NextAuth from "next-auth";
// 前のステップで作成した、認証ルール(authOptions)をインポート
import { authOptions } from "@/lib/auth";

/**
 * NextAuthのメインハンドラーの生成
 * * 先ほど定義したauthOptionsをNextAuth に渡すことで、
 * 実際の[ログイン]、[ログアウト]、[セッション確認]などの
 * 全ての認証処理を自動で行う関数(handler)を作成する
 */
const handler = NextAuth(authOptions);

/**
 * HTTPメソッドの公開設定
 * Next.js App Routerの規約に基づき、
 * GETリクエスト(セッション情報の取得など)と
 * POSTリクエスト(ログイン・ログアウトの実行など)の
 * 両方でこの認証ハンドラーが動作するように、名前を付けてエクスポートする
 */
export { handler as GET, handler as POST };


