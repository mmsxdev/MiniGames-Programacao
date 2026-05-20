import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Portugol Games — Aprenda Programação Jogando",
  description: "Plataforma de minigames educativos para aprender programação com Portugol. Exercícios interativos, quiz e quebra-cabeça de código.",
  keywords: "portugol, programação, educação, minigames, aprender a programar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="dark" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
