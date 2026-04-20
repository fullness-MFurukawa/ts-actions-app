import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, describe } from "vitest";
import Calc from "./Calc";

describe("Calcコンポーネントのテスト", () => {
  test("値1と値2を入力して加算ができること", () => {
    // コンポーネントを仮想DOMにレンダリングする
    render(<Calc />);

    // 画面上の要素(ユーザーが見るラベル名などを取得する
    const input1 = screen.getByLabelText("値1");
    const input2 = screen.getByLabelText("値2");
    const button = screen.getByRole("button", { name: "計算する" });

    // ユーザーの操作(入力とクリック)をシミュレートする
    fireEvent.change(input1, { target: { value: "10" } });
    fireEvent.change(input2, { target: { value: "20" } });
    // ※デフォルトが加算なので、Selectの変更は省略
    fireEvent.click(button);

    // 期待する結果が画面に表示されているか(DOMに存在するか)を検証する
    const resultDisplay = screen.getByTestId("result-display");
    expect(resultDisplay).toHaveTextContent("結果: 30");
  });

  test("0除算を行った際にエラーメッセージが表示されること", () => {
    render(<Calc />);

    const input1 = screen.getByLabelText("値1");
    const input2 = screen.getByLabelText("値2");
    const button = screen.getByRole("button", { name: "計算する" });

    // 計算の種類を除算に変更する
    // shadcn/uiのSelectは内部構造が複雑なため、非表示のselect要素を直接変更してシミュレートする
    const select = screen.getByLabelText("計算の種類");
    fireEvent.change(select, { target: { value: "div" } });

    // 10 ÷ 0 を実行
    fireEvent.change(input1, { target: { value: "10" } });
    fireEvent.change(input2, { target: { value: "0" } });
    fireEvent.click(button);

    // エラー表示が出ているか検証する
    const errorDisplay = screen.getByTestId("error-display");
    expect(errorDisplay).toHaveTextContent("エラー: 0で割ることはできません");
  });
});
