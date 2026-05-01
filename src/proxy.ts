// src/proxy.ts
import { NextFetchEvent } from "next/server";
import authMiddleware, { NextRequestWithAuth } from "next-auth/middleware";

export default function proxy(req: NextRequestWithAuth, event: NextFetchEvent) {
  // CI(E2Eテスト)環境なら、ログインチェックをスキップして許可する
  if (process.env.E2E_TEST === "true") {
    return;
  }

  // 通常時はNextAuthの保護機能を発動する
  return authMiddleware(req, event);
}

export const config = {
  matcher: ["/", "/Calc", "/search"],
};
