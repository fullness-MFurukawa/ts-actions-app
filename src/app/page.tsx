import Calc from "@/components/calc/Calc";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-50">
      {/* 作成した計算機コンポーネントを配置 */}
      <Calc />
    </main>
  );
}
