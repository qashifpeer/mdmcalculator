// src/app/rates/page.tsx
'use client';

import React, { useState } from 'react';
import { useSession } from "next-auth/react";

type RatesFormState = {
  prePrimaryRate: string;
  primaryRate: string;
  middleRate: string;
};

export default function RatesPage() {
  const [form, setForm] = useState<RatesFormState>({
    prePrimaryRate: '',
    primaryRate: '',
    middleRate: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

   const { data: session, status } = useSession();
      if (status === "loading") return <div>Loading session...</div>;
      if (!session) return <div>Please log in to proceed further</div>; // extra safety

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/input-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prePrimaryRate: Number(form.prePrimaryRate),
          primaryRate: Number(form.primaryRate),
          middleRate: Number(form.middleRate),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Request failed');

      setMessage('Rates saved successfully.');
      setForm({ prePrimaryRate: '', primaryRate: '', middleRate: '' });
    } catch (err: unknown) {
       const msg =
        err instanceof Error
          ? err.message
          : 'Failed to save rates. Please try again.';
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Input Rates
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="prePrimaryRate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pre-primary rate
            </label>
            <input
              id="prePrimaryRate"
              name="prePrimaryRate"
              type="number"
              value={form.prePrimaryRate}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="primaryRate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Primary rate
            </label>
            <input
              id="primaryRate"
              name="primaryRate"
              type="number"
              value={form.primaryRate}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="middleRate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Middle rate
            </label>
            <input
              id="middleRate"
              name="middleRate"
              type="number"
              min={0}
              value={form.middleRate}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save rates'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
