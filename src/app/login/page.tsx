import { headers } from "next/headers";

async function getCsrfToken(): Promise<string> {
  const headersList = await headers(); // ❗ no need to await
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const res = await fetch(`${protocol}://${host}/api/auth/csrf`, {
    cache: "no-store",
  });

  const data = (await res.json()) as { csrfToken: string };
  return data.csrfToken;
}

export default async function LoginPage() {
  const csrfToken = await getCsrfToken();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        method="POST"
        action="/api/auth/callback/credentials"
        className="bg-white shadow p-6 rounded w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">
          Mid-Day Meals Login
        </h1>

        <input type="hidden" name="csrfToken" value={csrfToken} />
        <input type="hidden" name="callbackUrl" value="/" />

        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            name="username"
            type="text"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            name="password"
            type="password"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}