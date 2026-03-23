"use client";

import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <header className="bg-blue-600 text-white p-4">
        <div className="max-w-4xl mx-auto">Loading...</div>
      </header>
    );
  }

  if (!session) return null; // hidden when not logged in

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">MDM Cal</h1>
          <p className="text-sm opacity-90">
            Logged in as <span className="font-medium">{session.user?.name || session.user?.email}</span>
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}