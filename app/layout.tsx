import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LangSetter } from "@/components/layout/LangSetter";

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "GoodsIndexuz - B2B Export Platform",
  description: "Wholesale export of agricultural products from Uzbekistan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LangSetter />
        {children}
      </body>
    </html>
  );
}

