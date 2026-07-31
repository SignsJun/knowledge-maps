import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generative Model Notes — DDPM, Score Matching & Flow Matching",
  description: "A public learning notebook on DDPM, score matching, and flow matching.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Generative Model Notes — DDPM, Score Matching & Flow Matching",
    description: "From noise to structure: three notes on generative models, shared in public.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Generative Model Notes — DDPM, Score Matching & Flow Matching",
    description: "From noise to structure: three notes on generative models, shared in public.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
