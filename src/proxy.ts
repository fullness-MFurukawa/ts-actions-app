import { withAuth } from "next-auth/middleware";

// 明示的にデフォルト関数としてエクスポートし、ビルドエンジンのチェックをクリア
export default withAuth();

export const config = {
  // 保護したい（ログイン必須にしたい）ページのパスを指定
  matcher: ["/", "/Calc", "/search"],
};