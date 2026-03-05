import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "組織成員｜人工智慧專責辦公室",
  description: "認識國立陽明交通大學人工智慧專責辦公室的組織成員與合作夥伴。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
