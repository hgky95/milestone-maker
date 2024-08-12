import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Milestone Maker",
  description: "Generate your learning path",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/milestone_maker.png" type="image/png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
