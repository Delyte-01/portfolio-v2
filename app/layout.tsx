import type { Metadata } from "next";

import "./globals.css";
import { satoshi, syne } from "./font";
import Header from "@/components/navbar";
import SmoothScroll from "@/components/lenis";

export const metadata: Metadata = {
  title: "Delyte portfolio ",
  description: "portfolio version 2 ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${satoshi.variable} h-full antialiased`}
    >
      <body>
        <SmoothScroll>
          <Header />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
