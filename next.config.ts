import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      // 已移除的獨立 team 頁面 → 首頁
      {
        source: "/team/:id",
        destination: "/",
        permanent: true,
      },
      // 已移除的全域 recruitment 列表 → 活動列表
      {
        source: "/recruitment",
        destination: "/events",
        permanent: true,
      },
      // 已移除的全域 recruitment 詳細頁 → 活動列表
      {
        source: "/recruitment/:id",
        destination: "/events",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
