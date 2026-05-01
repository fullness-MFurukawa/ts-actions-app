export { default } from "next-auth/middleware";
export const config = {
  // 保護したい（ログイン必須にしたい）ページのパスを指定します
  // 例: トップページ(/) と 計算画面(/Calc) と 検索画面(/search) を保護
  matcher: ["/", "/Calc", "/search"],
};
