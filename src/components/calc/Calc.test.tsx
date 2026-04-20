import { render, screen } from "@testing-library/react";
// 実際のユーザー操作（キーボード入力やマウスクリック）をより忠実にシミュレートするライブラリ
import userEvent from "@testing-library/user-event";
import { expect, test, describe } from "vitest";
import Calc from "./Calc";

// テストのグループ化（「Calc コンポーネントに関するテスト群」というまとまりを作る）
describe("Calc コンポーネントのテスト", () => {
  // --- テストケース1: 正常系（加算）のテスト ---
  test("値1と値2を入力して加算ができること", async () => {
    // 1. ユーザー操作のシミュレーターを初期化する
    const user = userEvent.setup();

    // 2. テスト対象のコンポーネントを仮想DOMにレンダリングする
    render(<Calc />);

    // 3. 画面上の要素を「ユーザーが見るラベル名」や「役割」で取得する
    const input1 = screen.getByLabelText("値1");
    const input2 = screen.getByLabelText("値2");
    const button = screen.getByRole("button", { name: "計算する" });

    // 4. ユーザーの操作（入力とクリック）を非同期でシミュレートする
    await user.type(input1, "10"); // 値1に「10」を入力
    await user.type(input2, "20"); // 値2に「20」を入力
    await user.click(button); // [計算する]ボタンをクリック
    // ※デフォルトが加算なので、ドロップダウンの変更操作は省略する

    // 5. 結果の検証
    // 計算結果はクリックした後に画面へ反映されるため、findByTestId()を使って要素の出現を待機する
    const resultDisplay = await screen.findByTestId("result-display");

    // 期待する結果が画面に表示されているかをチェックする
    expect(resultDisplay).toHaveTextContent("結果: 30");
  });

  // --- テストケース2: 異常系（0除算）のテスト ---
  test("0除算を行った際にエラーメッセージが表示されること", async () => {
    const user = userEvent.setup();
    render(<Calc />);

    const input1 = screen.getByLabelText("値1");
    const input2 = screen.getByLabelText("値2");
    const button = screen.getByRole("button", { name: "計算する" });

    // 値1に「10」を入力
    await user.type(input1, "10");

    // --- shadcn/uiのSelect（ドロップダウン）の操作 ---
    // 複雑なUIコンポーネントは、実際のユーザーと同じように「開いて」「選ぶ」手順をシミュレートする

    // 1. トリガー（ボタン）をクリックしてドロップダウンメニューを開く
    const selectTrigger = screen.getByRole("combobox", { name: "計算の種類" });
    await user.click(selectTrigger);

    // 2. メニューの中から「除算 (÷)」のオプションを探してクリックする
    const divOption = await screen.findByRole("option", { name: "除算 (÷)" });
    await user.click(divOption);

    // 値2に「0」を入力して計算ボタンを押す
    await user.type(input2, "0");
    await user.click(button);

    // エラー表示領域が出現するのを待機し、正しいメッセージが表示されているか検証する
    const errorDisplay = await screen.findByTestId("error-display");
    expect(errorDisplay).toHaveTextContent("エラー: 0で割ることはできません");
  });
});
