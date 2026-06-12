import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Portal IBGE — Educação & Sociedade",
  description: "Análise interativa dos dados do Censo Demográfico 2022 do IBGE, com foco na frequência escolar, situação de ocupação, meio de transporte e local de trabalho.",
  keywords: ["IBGE", "Censo 2022", "Educação", "Frequência Escolar", "Ocupação", "Transporte", "SIDRA"],
  authors: [{ name: "Portal IBGE" }],
  icons: {
    icon: "/favicon.ico",
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
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              {children}
              <Footer />
            </div>
          </AuthProvider>
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}
