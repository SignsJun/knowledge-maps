import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yifan’s Notes — Generative Models",
  description: "A public learning notebook on DDPM, score-based models, flow matching, and beyond.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Yifan’s Notes — Generative Models",
    description: "From noise to structure: notes on generative models, shared in public.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yifan’s Notes — Generative Models",
    description: "From noise to structure: notes on generative models, shared in public.",
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
