import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Сказки — персональные детские истории",
  description:
    "Создавайте персональные детские сказки на русском языке с уютными иллюстрациями",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${nunito.variable} font-sans antialiased`}>
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
