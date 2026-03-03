// src/app/income-report/page.tsx
'use client';

import React, { useState } from 'react';

type IncomeRow = {
  _id: string;
  date: string;
  prePrimaryAmount?: number;
  primaryAmount?: number;
  middleAmount?: number;
  total: number; // NEW: computed in API
};

type RiceRow = {
  _id: string;
  date: string;
  prePrimaryQty?: number;
  primaryQty?: number;
  middleQty?: number;
  total: number; // NEW: computed in API
};


type Totals = {
  income: number;
  rice: number;
};

type ApiResponse = {
  success: boolean;
  from: string;
  to: string;
  incomes: IncomeRow[];
  rice: RiceRow[];
  totals: Totals;
};

export default function IncomeReportPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch('/api/income-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to }),
      });

      const json = (await res.json()) as ApiResponse & { error?: string };
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Request failed');
      }
      setData(json);
    } catch (err:unknown) {
      const msg= 
      err instanceof Error
      ? err.message
      : 'Failed to load income report.'
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-4 md:p-6">
        {/* Controls */}
        <div className="print:hidden">
          <h1 className="text-2xl font-semibold text-center mb-2">
            Income & Rice Receipt Report
          </h1>
          <p className="text-center text-sm text-gray-600 mb-4">
            Select date range to see income received and rice received
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-4 items-end justify-center mb-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From date
              </label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Loading...' : 'Generate report'}
            </button>

            {data && (
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Print
              </button>
            )}
          </form>

          {error && (
            <p className="text-center text-sm text-red-600 mb-4">
              {error}
            </p>
          )}
        </div>

        {/* Report */}
        {data && (
          <div className="space-y-4 text-[10px] leading-tight">
            <div className="flex justify-between text-xs">
              <div>
                <p className="font-semibold">Income & Rice Receipt Report</p>
                <p>
                  From: <span className="font-medium">{data.from}</span>
                </p>
                <p>
                  To: <span className="font-medium">{data.to}</span>
                </p>
              </div>
            </div>

            {/* Income table */}
            <section>
              <h2 className="font-semibold mb-1 text-xs">Income Received</h2>
              <table className="w-full text-[9px] border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-1 py-1 text-left">
                      S.No
                    </th>
                    <th className="border border-gray-300 px-1 py-1 text-left">
                      Date
                    </th>
                    <th className="border border-gray-300 px-1 py-1 text-right">
                      Amount (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.incomes.map((row, idx) => (
                    <tr key={row._id}>
                      <td className="border border-gray-300 px-1 py-0.5">
                        {idx + 1}
                      </td>
                      <td className="border border-gray-300 px-1 py-0.5">
                        {row.date}
                      </td>
                      <td className="border border-gray-300 px-1 py-0.5 text-right">
                        {(row.total ?? 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold">
                    <td
                      className="border border-gray-300 px-1 py-0.5"
                      colSpan={2}
                    >
                      Total
                    </td>
                    <td className="border border-gray-300 px-1 py-0.5 text-right">
                      {data.totals.income.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Rice table */}
            <section>
              <h2 className="font-semibold mb-1 text-xs">Rice Received</h2>
              <table className="w-full text-[9px] border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-1 py-1 text-left">
                      S.No
                    </th>
                    <th className="border border-gray-300 px-1 py-1 text-left">
                      Date
                    </th>
                    <th className="border border-gray-300 px-1 py-1 text-right">
                      Quantity (kg)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.rice.map((row, idx) => (
                    <tr key={row._id}>
                      <td className="border border-gray-300 px-1 py-0.5">
                        {idx + 1}
                      </td>
                      <td className="border border-gray-300 px-1 py-0.5">
                        {row.date}
                      </td>
                      <td className="border border-gray-300 px-1 py-0.5 text-right">
                        {(row.total ?? 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold">
                    <td
                      className="border border-gray-300 px-1 py-0.5"
                      colSpan={2}
                    >
                      Total
                    </td>
                    <td className="border border-gray-300 px-1 py-0.5 text-right">
                      {data.totals.rice.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* Print styles */}
        <style jsx global>{`
          @media print {
            @page {
              size: A4;
              margin: 10mm;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print\\:hidden {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </main>
  );
}
