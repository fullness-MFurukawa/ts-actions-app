/**
 * 演習7-3 shadcn/uiを使った計算機コンポーネントとテストを追加する
 * 計算処理を担当するサービス
 */
export const calculatorService = {
  /**
   * 指定された2つの値と演算子に基づいて計算結果を返す
   * @param val1 値1
   * @param val2 値2
   * @param operator 演算子 ('add' | 'sub' | 'mul' | 'div' | 'mod')
   * @returns 計算結果
   */
  calculate: (val1: number, val2: number, operator: string): number => {
    switch (operator) {
      case "add":
        return val1 + val2; // 加算
      case "sub":
        return val1 - val2; // 減算
      case "mul":
        return val1 * val2; // 乗算
      case "div":
        if (val2 === 0) throw new Error("0で割ることはできません");
        return val1 / val2; // 除算
      case "mod":
        if (val2 === 0) throw new Error("0で割ることはできません");
        return val1 % val2; // 剰余
      default:
        throw new Error("サポートされていない演算子です");
    }
  },
};
