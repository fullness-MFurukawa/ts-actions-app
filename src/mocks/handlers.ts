import { http, HttpResponse } from "msw";

/**
 * APIのモック定義
 * どのURLに、どんなデータが送られてきたら、何を返すかを定義する
 */
export const handlers = [
  // http.postはPOSTメソッドの通信を監視することを意味する
  http.post(`${process.env.API_BASE_URL}/api/auth/login`, async ({ request }) => {
    // 【Step1】送信されたデータを解析
    // フロントエンドからfetchで送られてきたJSONボディを取り出す
    interface LoginRequestBody {
      usernameOrEmail?: string;
      password?: string;
    }
    const body = (await request.json()) as LoginRequestBody;
    const { usernameOrEmail, password } = body;

    // --- ここから API の振る舞いをシミュレートする ---

    // 1. バリデーションエラー(400 Bad Request)のシミュレーション
    // IDが未入力だった場合、標準のエラー形式を再現して返す
    if (!usernameOrEmail) {
      return HttpResponse.json(
        {
          type: "https://tools.ietf.org/html/rfc9110#section-15.5.1",
          title: "One or more validation errors occurred.",
          status: 400,
          errors: {
            UsernameOrEmail: ["ユーザー名またはメールアドレスは必須です。"],
          },
          traceId: "dummy-trace-id",
        },
        { status: 400 },
      );
    }

    // 2. ユーザー不在(404 Not Found)のシミュレーション
    // 特定の文字列が送られてきたら、存在しないというエラーを返す
    // これにより、テストコード側でユーザー不在時の表示を確認できる
    if (usernameOrEmail === "unknown") {
      return HttpResponse.json(
        { message: "ユーザーが存在しません。" },
        { status: 401 },
      );
    }

    // 3. パスワード不一致(401 Unauthorized)のシミュレーション
    // 特定の文字列が送られてきたら、パスワード間違いを返す
    if (password === "wrong-password") {
      return HttpResponse.json(
        { message: "パスワードが一致しません。" },
        { status: 401 },
      );
    }

    // 4. 認証成功(200 OK)のシミュレーション
    // 上記のいずれにも当てはまらない正しいデータが来たら、ダミーのJWTトークンを返す
    return HttpResponse.json(
      {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0N2Y0M2IyNS02NWM3LTQ5OTMtYTA5NS1kZjU1ZmM2YmZmNjEiLCJqdGkiOiJjN2NmOTkyMTViNjQ0NjI5YjZlMzgyNzdhYjkxZmFlZCIsImlhdCI6MTc3NzU5NDA2NCwidW5pcXVlX25hbWUiOiJ5YW1hZGEiLCJlbWFpbCI6InlhbWFkYUBleGFtcGxlLmNvbSIsIm5iZiI6MTc3NzU5NDA2NCwiZXhwIjoxNzc3NTk3NjY0LCJpc3MiOiJFeGVyY2lzZTpCYWNrZW5kIiwiYXVkIjoiRXhlcmNpc2U6RnJvbnRlbmQifQ.5pYsiQWKurpSRb1VNvu3xXsuqpctj2AiljQUmZSafbU",
      },
      { status: 200 },
    );
  }),
];
