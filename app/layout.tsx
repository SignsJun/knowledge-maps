import type { Metadata } from "next";
import Script from "next/script";
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
      <body>
        {children}
        <Script id="mathjax-config" strategy="beforeInteractive">
          {`window.MathJax = { tex: { inlineMath: [['\\\\(', '\\\\)'], ['$', '$']], displayMath: [['\\\\[', '\\\\]'], ['$$', '$$']] }, svg: { fontCache: 'global' } };`}
        </Script>
        <Script id="mathjax" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
