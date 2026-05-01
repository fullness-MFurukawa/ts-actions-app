export { default } from "next-auth/middleware";
export const config = {
  // 保護したい(ログイン必須にしたい)ページのパスを指定する
  // 例: トップページ(/)と計算画面(/Calc)と検索画面(/search)を保護
  matcher: ["/", "/Calc", "/search"],
};
