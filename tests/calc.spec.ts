import { test, expect } from "@playwright/test";

// テストのグループ化
test.describe("計算機(E2E)のテスト", () => {
  // 各テストが実行される前に、自動的にトップページ(計算機画面)にアクセスする
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });

  test("値1と値2を入力して加算ができること", async ({ page }) => {
    // 1. ラベル名を目印に入力欄を取得し、値を入力する
    await page.getByLabel("値1").fill("10");
    await page.getByLabel("値2").fill("20");

    // 2. ボタンをクリックする
    await page.getByRole("button", { name: "計算する" }).click();

    // 3. 計算結果が画面に正しく表示されることを検証する
    // Playwrightは結果が表示されるまで自動で待機(Auto-waiting)してくれます
    const resultDisplay = page.getByTestId("result-display");
    await expect(resultDisplay).toHaveText("結果: 30");
  });

  test("0除算を行った際にエラーメッセージが表示されること", async ({
    page,
  }) => {
    await page.getByLabel("値1").fill("10");

    // --- shadcn/uiのドロップダウン(Select)の操作 ---
    // 実際のユーザーと同じように、クリックしてメニューを開き、項目を選ぶ
    await page.getByRole("combobox", { name: "計算の種類" }).click();
    await page.getByRole("option", { name: "除算 (÷)" }).click();

    await page.getByLabel("値2").fill("0");
    await page.getByRole("button", { name: "計算する" }).click();

    // エラーメッセージが正しく表示されることを検証する
    const errorDisplay = page.getByTestId("error-display");
    await expect(errorDisplay).toHaveText("エラー: 0で割ることはできません");
  });
});
