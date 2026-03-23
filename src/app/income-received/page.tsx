// src/app/incomereceived/page.tsx
'use client';

import React, { useState } from 'react';
import { useSession } from "next-auth/react";

type IncomeFormState = {
  date: string;
  prePrimaryAmount: string;
  primaryAmount: string;
  middleAmount: string;
};

export default function IncomeReceivedPage() {
  const [form, setForm] = useState<IncomeFormState>({
    date: '',
    prePrimaryAmount: '',
    primaryAmount: '',
    middleAmount: '',
  });
  


  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { data: session, status } = useSession();
    if (status === "loading") return <div>Loading session...</div>;
    if (!session) return <div>Please log in to proceed further</div>; // extra safety

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/income-received', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: form.date,
          prePrimaryAmount: Number(form.prePrimaryAmount),
          primaryAmount: Number(form.primaryAmount),
          middleAmount: Number(form.middleAmount),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Request failed');
      }

      setMessage('Income entry saved successfully.');
      setForm({
        date: '',
        prePrimaryAmount: '',
        primaryAmount: '',
        middleAmount: '',
      });
    } catch (err:unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to save income. Please try again.';
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-slate-900">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Income Received
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="prePrimaryAmount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pre-primary amount (₹)
            </label>
            <input
              id="prePrimaryAmount"
              name="prePrimaryAmount"
              type="number"
              min={0}
              step="0.01"
              value={form.prePrimaryAmount}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="primaryAmount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Primary amount (₹)
            </label>
            <input
              id="primaryAmount"
              name="primaryAmount"
              type="number"
              min={0}
              step="0.01"
              value={form.primaryAmount}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="middleAmount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Middle amount (₹)
            </label>
            <input
              id="middleAmount"
              name="middleAmount"
              type="number"
              min={0}
              step="0.01"
              value={form.middleAmount}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save income'}
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
