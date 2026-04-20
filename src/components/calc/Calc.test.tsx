import { render, screen } from "@testing-library/react";
// より実際のユーザー操作に近いシミュレートを行う userEvent をインポート
import userEvent from "@testing-library/user-event";
import { expect, test, describe } from "vitest";
import Calc from "./Calc";

describe("Calc コンポーネントのテスト", () => {
  test("値1と値2を入力して加算ができること", async () => {
    // ユーザーイベントのセットアップ
    const user = userEvent.setup();
    render(<Calc />);

    const input1 = screen.getByLabelText("値1");
    const input2 = screen.getByLabelText("値2");
    const button = screen.getByRole("button", { name: "計算する" });

    // ユーザーのキーボード入力をシミュレート（非同期）
    await user.type(input1, "10");
    await user.type(input2, "20");
    // ボタンのクリックをシミュレート
    await user.click(button);

    // テスト対象の要素が出現するのを待機して検証
    const resultDisplay = await screen.findByTestId("result-display");
    expect(resultDisplay).toHaveTextContent("結果: 30");
  });

  test("0除算を行った際にエラーメッセージが表示されること", async () => {
    const user = userEvent.setup();
    render(<Calc />);

    const input1 = screen.getByLabelText("値1");
    const input2 = screen.getByLabelText("値2");
    const button = screen.getByRole("button", { name: "計算する" });

    await user.type(input1, "10");

    // === shadcn/ui の Select の操作 ===
    // 1. トリガー（ボタン）をクリックしてドロップダウンメニューを開く
    const selectTrigger = screen.getByRole("combobox", { name: "計算の種類" });
    await user.click(selectTrigger);

    // 2. メニューの中から「除算 (÷)」のオプションを探してクリックする
    const divOption = await screen.findByRole("option", { name: "除算 (÷)" });
    await user.click(divOption);

    await user.type(input2, "0");
    await user.click(button);

    // エラー表示が出ているか検証する
    const errorDisplay = await screen.findByTestId("error-display");
    expect(errorDisplay).toHaveTextContent("エラー: 0で割ることはできません");
  });
});
