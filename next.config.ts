import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 以下の1行を追記！
  output: 'standalone',
  // (もし他に設定が書いてあれば、それはそのまま残しておいてください)
};

export default nextConfig;
