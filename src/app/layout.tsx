import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portal IBGE — Educação & Sociedade",
  description: "Análise interativa dos dados do Censo Demográfico 2022 do IBGE, com foco na frequência escolar, situação de ocupação, meio de transporte e local de trabalho.",
  keywords: ["IBGE", "Censo 2022", "Educação", "Frequência Escolar", "Ocupação", "Transporte", "SIDRA"],
  authors: [{ name: "Portal IBGE" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Portal IBGE — Educação & Sociedade",
    description: "Dados do Censo 2022 do IBGE com foco em educação",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
