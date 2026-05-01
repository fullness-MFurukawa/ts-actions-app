import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * NextAuthの設定オプション
 * アプリケーション全体の認証ルール(どのAPIを使うか、どうデータを保持するか)を定義する
 */
export const authOptions: NextAuthOptions = {
  // 1. 認証プロバイダーの設定
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // ログイン画面で入力させる項目の定義
      credentials: {
        usernameOrEmail: { label: "UsernameorEmail", type: "text" },
        password: { label: "Password", type: "password" },
      },

      /**
       * 認証ロジックの実装
       * ユーザーが[ログイン]ボタンを押した際、バックエンドAPIと通信して正当性を確認する
       */
      async authorize(credentials) {
        try {
          // 【Step1】バックエンドAPIへ認証リクエストを送信
          // C#等で作成した外部のログインAPIに対して、入力されたIDとパスワードをPOSTする
          const res = await fetch("http://74.226.194.15/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
              usernameOrEmail: credentials?.usernameOrEmail,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          // 【Step2】認証成功時の処理(HTTP 200 OK)
          // APIから返ってきたトークン情報(JWT)を取得し、NextAuthに渡す
          if (res.ok) {
            const token = await res.json();
            return token; // ここで返した値が、下のjwtコールバックの「user」に入る
          }

          // 【Step3】認証失敗時のエラーハンドリング
          // APIからエラー詳細（JSON）を取得し、内容に応じてメッセージを出力しわける
          const errorData = await res.json();

          // バリデーションエラー(400 Bad Request)の場合
          // C#の標準的なエラー形式（errors.UsernameOrEmail）からメッセージを取り出して通知する
          if (res.status === 400 && errorData.errors?.UsernameOrEmail) {
            throw new Error(errorData.errors.UsernameOrEmail[0]);
          }

          // B. ユーザー不在(404)やパスワード間違い(401)の場合
          // APIが返した独自のメッセージがあればそれを採用する
          if (errorData.message) {
            throw new Error(errorData.message);
          }

          // C. その他の予期せぬ失敗
          throw new Error("ログインに失敗しました。");
        } catch (error: unknown) {
          // 【Step4】通信エラー等のキャッチ
          // ネットワーク切断や、APIサーバー自体がダウンしている場合の処理
          console.error("★★★ バックエンドAPIとの通信エラー詳細 ★★★", error);
          // 画面側にエラー内容を伝えるため、Errorをスローする
          const errorMessage =
            error instanceof Error ? error.message : "通信エラーが発生しました";
          throw new Error(errorMessage);
        }
      },
    }),
  ],

  // 2. カスタムページの定義
  pages: {
    // NextAuth標準のログイン画面ではなく、自作した「/login」ページへリダイレクトさせる
    signIn: "/login",
  },

  // 3. コールバック処理(データの受け渡し設定)
  callbacks: {
    /**
     * JWTトークンの作成・更新時
     * authorizeで返されたユーザー情報を、JWTを通じてセッションに保持するための処理
     */
    async jwt({ token, user }) {
      if (user) {
        // authorizeから返ってきた情報をトークン内にマージする
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { ...token, ...(user as any) };
      }
      return token;
    },

    /**
     * セッションの参照時
     * Reactコンポーネント(useSession等)から、トークン内の情報を参照できるようにする
     */
    async session({ session, token }) {
      if (session.user) {
        // JWT内に保存されている情報を、セッションのuserオブジェクトとして公開する
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        session.user = token as any;
      }
      return session;
    },
  },
};
