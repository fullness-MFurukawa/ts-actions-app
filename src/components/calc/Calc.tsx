"use client"; // Next.js(App Router)において、このコンポーネントがブラウザ側で動作するクライアントコンポーネントであることを宣言(useStateなどのHookを使うために必須)

import React from "react";
// ビジネスロジックと状態管理を分離したカスタムHookをインポート
import { useCalculator } from "@/hooks/useCalculator";

// shadcn/ui のコンポーネント群をインポート（UIの見た目とアクセシビリティを担保）
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * 演習7-3 shadcn/uiを使った計算機コンポーネントとテストを追加する
 * 計算機UIコンポーネント
 * 画面の描画と、ユーザーからの入力受け付けのみを担当する
 * 実際の計算ロジックや状態管理はカスタムHook(useCalculator)に委譲
 */
export default function Calc() {
  // カスタムHookを呼び出し、画面描画に必要な状態(値)と操作(関数)を取り出す
  const {
    val1,               // 入力された値1
    setVal1,            // 値1を更新する関数
    val2,               // 入力された値2
    setVal2,            // 値2を更新する関数
    operator,           // 選択された計算種類
    setOperator,        // 計算種類を更新する関数
    result,             // 計算結果
    error,              // エラーメッセージ
    executeCalculation, // 計算を実行する関数
  } = useCalculator();

  return (
    // Cardコンポーネントで全体を囲み、計算機らしい見た目を作る
    <Card className="w-[400px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">計算機</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* === 値1の入力エリア === */}
        <div className="space-y-2">
          {/* LabelのhtmlForとInputのidを一致させることで、ラベルクリック時にフォーカスが当たるようにする */}
          <Label htmlFor="val1">値1</Label>
          <Input
            id="val1"
            type="number"
            placeholder="数値を入力してください"
            value={val1}
            // ユーザーが入力した値(e.target.value)を、Hookの状態(val1)に即座に反映させる
            onChange={(e) => setVal1(e.target.value)}
          />
        </div>

        {/* === 計算種類の選択（ドロップダウン）エリア === */}
        <div className="space-y-2">
          <Label htmlFor="operator">計算の種類</Label>
          {/* shadcn/uiのSelectコンポーネント */}
          {/*onValueChangeで選択された値をHookの状態(operator)に反映させる */}
          <Select value={operator} onValueChange={setOperator}>
            <SelectTrigger id="operator">
              <SelectValue placeholder="計算を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="add">加算 (+)</SelectItem>
              <SelectItem value="sub">減算 (-)</SelectItem>
              <SelectItem value="mul">乗算 (×)</SelectItem>
              <SelectItem value="div">除算 (÷)</SelectItem>
              <SelectItem value="mod">剰余 (%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* === 値2の入力エリア === */}
        <div className="space-y-2">
          <Label htmlFor="val2">値2</Label>
          <Input
            id="val2"
            type="number"
            placeholder="数値を入力してください"
            value={val2}
            onChange={(e) => setVal2(e.target.value)}
          />
        </div>

        {/* === 計算実行ボタン === */}
        <Button 
          className="w-full text-lg font-semibold" 
          // ボタンがクリックされたら、Hookの計算実行関数を呼び出します
          onClick={executeCalculation}
        >
          計算する
        </Button>

        {/* === 結果表示エリア === */}
        {/* resultがnullではない場合のみ、このdiv要素を表示する */}
        {result !== null && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            {/* data-testidは、後で実行する自動テスト(React Testing Library)で、この要素を見つけやすくするための目印 */}
            <p className="text-green-800 font-bold text-center" data-testid="result-display">
              結果: {result}
            </p>
          </div>
        )}

        {/* === エラー表示エリア === */}
        {/* errorにメッセージが入っている場合のみ表示する */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            {/* エラーメッセージ用の目印もテストのために付与 */}
            <p className="text-red-800 font-bold text-center" data-testid="error-display">
              エラー: {error}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}