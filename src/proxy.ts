// src/proxy.ts
import authMiddleware from "next-auth/middleware";

// 明示的に「proxy」という名前のデフォルト関数を定義
export default function proxy(req: any, event: any) {
  // 内部でNextAuthのミドルウェアに処理を委譲
  return authMiddleware(req, event);
}

export const config = {
  // 保護したい（ログイン必須にしたい）ページのパスを指定
  matcher: ["/", "/Calc", "/search"],
};
