import { NextFetchEvent } from "next/server";
import authMiddleware, { NextRequestWithAuth } from "next-auth/middleware";

// 関数名を明示的にmiddlewareとすることで、Next.jsの厳しいビルドチェックをクリアする
export default function middleware(
  req: NextRequestWithAuth,
  event: NextFetchEvent,
) {
  // E2Eテスト環境なら、ログインチェックをスキップ
  if (process.env.E2E_TEST === "true") {
    return;
  }

  // NextAuthの保護機能を利用し、未ログインなら強制リダイレクトする
  return authMiddleware(req, event);
}

export const config = {
  // 保護したいページのパスを指定
  matcher: ["/", "/Calc", "/search"],
};
