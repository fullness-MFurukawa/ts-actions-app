import { useState } from "react";
import { calculatorService } from "@/service/calculatorService";

/**
 * 演習7-3 shadcn/uiを使った計算機コンポーネントとテストを追加する
 * 計算機の状態管理とUIロジックを担当するカスタムHook
 */
export const useCalculator = () => {
  // ユーザーが入力する値（画面の入力欄は文字列なので string 型で管理する）
  const [val1, setVal1] = useState<string>("");
  const [val2, setVal2] = useState<string>("");

  // 選択された計算の演算子（初期値は 'add' = 加算）
  const [operator, setOperator] = useState<string>("add");

  // 計算結果を保持する状態（未計算時は null）
  const [result, setResult] = useState<number | null>(null);

  // エラーメッセージを保持する状態（エラーがない時は null）
  const [error, setError] = useState<string | null>(null);

  /**
   * 計算を実行する関数（画面の[計算]ボタンが押された時に呼び出される）
   */
  const executeCalculation = () => {
    // 1. 実行前に、前回の計算結果とエラー状態をリセット（初期化）する
    setError(null);
    setResult(null);

    // 2. 文字列として入力された値を数値(浮動小数点数)に変換する
    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);

    // 3. 入力値のバリデーション（正しい数値に変換できたかをチェック）
    if (isNaN(num1) || isNaN(num2)) {
      setError("有効な数値を入力してください");
      return; // 数値以外が入力されていた場合は、ここで処理を終了する
    }

    // 4. 計算処理の実行とエラーハンドリング
    try {
      // サービス層のビジネスロジックを呼び出して計算を行う
      const res = calculatorService.calculate(num1, num2, operator);

      // 計算に成功した場合は、結果を状態にセットして画面に反映させる
      setResult(res);
    } catch (err: unknown) {
      // any ではなく unknown を使用する（または省略する）
      // 0除算(ゼロで割る)などの例外が発生した場合は、エラーメッセージを画面に表示する
      // err が Error オブジェクトかどうかを判定（Type Guard）
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("予期せぬエラーが発生しました");
      }
    }
  };

  // UIコンポーネント（画面側）で利用する状態変数と関数をまとめて返す
  return {
    val1,
    setVal1,
    val2,
    setVal2,
    operator,
    setOperator,
    result,
    error,
    executeCalculation,
  };
};
