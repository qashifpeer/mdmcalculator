"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid username or password");
      return;
    }

    // Always send to home (or /meals-entry)
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Mid-Day Meals Login</h1>

        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}

        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            name="username"
            className="w-full border rounded px-3 py-2"
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            name="password"
            type="password"
            className="w-full border rounded px-3 py-2"
            autoComplete="current-password"
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}