// src/proxy.ts
import { NextFetchEvent } from "next/server";
import authMiddleware, { NextRequestWithAuth } from "next-auth/middleware";

// anyを排除し、Next.jsとNextAuthが提供する正しい型を設定
export default function proxy(req: NextRequestWithAuth, event: NextFetchEvent) {
  return authMiddleware(req, event);
}

export const config = {
  // 保護したい（ログイン必須にしたい）ページのパスを指定
  matcher: ["/", "/Calc", "/search"],
};
