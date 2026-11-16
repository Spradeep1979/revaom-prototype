import type { Metadata } from "next";
import "./globals.css";
import "./motion.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "REVAÔM — RESET Clarifying Serum | ActivIQ™",
  description:
    "Targeted clarifying serum powered by Salicylic Acid, Clarifying Peptides, and Zinc PCA with ActivIQ™ cellular delivery. Precision skincare for acne-prone skin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-[#0f0206]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0f0206] text-[#eee4d8] antialiased overflow-x-clip selection:bg-[#3a0716]/40 selection:text-[#eee4d8]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
