// src/app/report/page.tsx
'use client';

import React, { useState } from 'react';

type Totals = {
  prePrimary: number;
  primary: number;
  middle: number;
};

export default function ReportPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTotals(null);

    try {
      const res = await fetch('/api/meals-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Request failed');
      }

      setTotals(data.totals);
    } catch (err: unknown) {
      const msg = 
      err instanceof Error
      ? err.message
      : 'Failed to load summary. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Mid Day Meal Report
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From date
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To date
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Loading...' : 'Get report'}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {totals && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Totals for selected range</h2>
            <div className="overflow-hidden rounded-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Segment
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Total meals
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2">Pre-primary</td>
                    <td className="px-4 py-2">{totals.prePrimary}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Primary</td>
                    <td className="px-4 py-2">{totals.primary}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Middle</td>
                    <td className="px-4 py-2">{totals.middle}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
