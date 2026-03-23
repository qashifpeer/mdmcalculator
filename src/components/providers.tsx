"use client";  // ✅ Makes it Client Component

import { SessionProvider } from "next-auth/react";
import Header from "../components/header/Header";  // your header with useSession

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Header />
      {children}
    </SessionProvider>
  );
}