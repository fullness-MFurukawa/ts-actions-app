import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// 定義したハンドラーを使って、テスト用の擬似サーバーを構築
export const server = setupServer(...handlers);
