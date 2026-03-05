import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "關於我們｜人工智慧專責辦公室",
  description: "了解國立陽明交通大學人工智慧專責辦公室的成立背景、使命與願景。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
