import "@/app/globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/lib/supabase/server";
import { SquircleNoScript } from "@squircle-js/react";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const notoSansMono = Noto_Sans_Mono({
  variable: "--font-noto-sans-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "國立陽明交通大學 人工智慧專責辦公室",
  description: "Office of AI Affairs",
  verification: {
    google: "vjj3Fw7BmozLkeGrZTCo6PYVVqBhPQG6tTvbQel7fwM",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: pinnedEvents } = await supabase
    .from("events")
    .select("name, slug")
    .eq("pinned", true)
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className={`${notoSans.variable} ${notoSansMono.variable} antialiased`}>
        <SquircleNoScript />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NuqsAdapter>
            <AuthProvider>
              <div className="relative flex flex-col min-h-dvh">
                <Header pinnedEvents={pinnedEvents ?? []} />
                <div className="flex-1">
                  {children}
                </div>
                <Footer />
              </div>
              <Toaster />
            </AuthProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
