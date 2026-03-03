// src/app/ricereceived/page.tsx
'use client';

import React, { useState } from 'react';

type RiceFormState = {
  date: string;
  prePrimaryQty: string;
  primaryQty: string;
  middleQty: string;
};

export default function RiceReceivedPage() {
  const [form, setForm] = useState<RiceFormState>({
    date: '',
    prePrimaryQty: '',
    primaryQty: '',
    middleQty: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/rice-received', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: form.date,
          prePrimaryQty: Number(form.prePrimaryQty),
          primaryQty: Number(form.primaryQty),
          middleQty: Number(form.middleQty),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Request failed');
      }

      setMessage('Rice entry saved successfully.');
      setForm({
        date: '',
        prePrimaryQty: '',
        primaryQty: '',
        middleQty: '',
      });
    } catch (err: unknown) {
       const msg =
        err instanceof Error
          ? err.message
          : 'Failed to save rice entry. Please try again.';
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-slate-900">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Rice Received
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
              htmlFor="prePrimaryQty"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pre-primary rice (kg)
            </label>
            <input
              id="prePrimaryQty"
              name="prePrimaryQty"
              type="number"
              min={0}
              step="0.01"
              value={form.prePrimaryQty}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="primaryQty"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Primary rice (kg)
            </label>
            <input
              id="primaryQty"
              name="primaryQty"
              type="number"
              min={0}
              step="0.01"
              value={form.primaryQty}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="middleQty"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Middle rice (kg)
            </label>
            <input
              id="middleQty"
              name="middleQty"
              type="number"
              min={0}
              step="0.01"
              value={form.middleQty}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save rice entry'}
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
