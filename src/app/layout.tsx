import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "Mid Day Meals",
  description: "By Qashif Peer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
         <Navbar />
         <Providers>{children}</Providers>
        </body>
    </html>
  );
}
