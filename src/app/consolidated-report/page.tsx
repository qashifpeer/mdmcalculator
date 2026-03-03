// src/app/consolidated-report/page.tsx
'use client';

import React, { useState } from 'react';

type Totals = {
  meals: {
    prePrimary: number;
    primary: number;
    middle: number;
    all: number;
  };
  income: {
    openingAmountBalance: number;
    totalReceivedAmount: number;
    totalAvailableAmount: number;
    closingAmountBalance: number;
  };
  expenditure: {
    prePrimary: number;
    primary: number;
    middle: number;
    totalExpenditure: number;
  };
  rice: {
    openingRiceBalance: number;
    totalRiceLifted: number;
    totalRiceAvailable: number;
    totalRiceConsumed: number;
    closingRiceBalance: number;
  };
  rates: {
    prePrimaryRate: number;
    primaryRate: number;
    middleRate: number;
  };
};

type ApiResponse = {
  success: boolean;
  from: string;
  to: string;
  totals: Totals;
};

export default function ConsolidatedReportPage() {
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
      const res = await fetch('/api/consolidated-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to }),
      });

      const json = (await res.json()) as ApiResponse & { error?: string };
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Request failed');
      }
      setData(json);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to load consolidated report.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-4 md:p-6 print:p-4 print:shadow-none">
        {/* Controls */}
        <div className="print:hidden">
          <h1 className="text-2xl font-semibold text-center mb-2">
            Consolidated Mid Day Meals Report
          </h1>
          <p className="text-center text-sm text-gray-600 mb-4">
            Select date range to generate consolidated report
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
              {loading ? 'Generating...' : 'Generate report'}
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

        {/* Report content */}
        {data && (
          <div className="space-y-4 text-[10px] leading-tight">
            {/* Header */}
            <div className="flex flex-wrap justify-between">
              <div>
                <p className="font-semibold text-xs">
                  Consolidated Mid Day Meals Report
                </p>
                <p>
                  From: <span className="font-medium">{data.from}</span>
                </p>
                <p>
                  To: <span className="font-medium">{data.to}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium mb-1">Ingredient Rates</p>
                <p>
                  Pre-Primary: ₹{data.totals.rates.prePrimaryRate.toFixed(2)}
                </p>
                <p>Primary: ₹{data.totals.rates.primaryRate.toFixed(2)}</p>
                <p>Middle: ₹{data.totals.rates.middleRate.toFixed(2)}</p>
              </div>
            </div>

            {/* Meals Summary */}
            <section>
              <h2 className="font-semibold mb-1 text-xs">Meals Summary</h2>
              <table className="w-full text-[9px] border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-1 py-1 text-left">
                      Section
                    </th>
                    <th className="border border-gray-300 px-1 py-1 text-right">
                      Total meals
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-1 py-0.5">
                      Pre-Primary
                    </td>
                    <td className="border border-gray-300 px-1 py-0.5 text-right">
                      {data.totals.meals.prePrimary}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-1 py-0.5">
                      Primary
                    </td>
                    <td className="border border-gray-300 px-1 py-0.5 text-right">
                      {data.totals.meals.primary}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-1 py-0.5">
                      Middle
                    </td>
                    <td className="border border-gray-300 px-1 py-0.5 text-right">
                      {data.totals.meals.middle}
                    </td>
                  </tr>
                  <tr className="bg-gray-50 font-semibold">
                    <td className="border border-gray-300 px-1 py-0.5">Total</td>
                    <td className="border border-gray-300 px-1 py-0.5 text-right">
                      {data.totals.meals.all}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Middle: Expenditure + Rice */}
            <section className="grid gap-3 md:grid-cols-2">
              <div>
                <h2 className="font-semibold mb-1 text-xs">
                  Ingredients (Expenditure)
                </h2>
                <table className="w-full text-[9px] border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-1 py-1 text-left">
                        Section
                      </th>
                      <th className="border border-gray-300 px-1 py-1 text-right">
                        Expenditure
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-1 py-0.5">
                        Pre-Primary
                      </td>
                      <td className="border border-gray-300 px-1 py-0.5 text-right">
                        ₹{data.totals.expenditure.prePrimary.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-1 py-0.5">
                        Primary
                      </td>
                      <td className="border border-gray-300 px-1 py-0.5 text-right">
                        ₹{data.totals.expenditure.primary.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-1 py-0.5">
                        Middle
                      </td>
                      <td className="border border-gray-300 px-1 py-0.5 text-right">
                        ₹{data.totals.expenditure.middle.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h2 className="font-semibold mb-1 text-xs">Rice Details</h2>
                <table className="w-full text-[9px] border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-1 py-1 text-left">
                        Description
                      </th>
                      <th className="border border-gray-300 px-1 py-1 text-right">
                        Qty (kg)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-1 py-0.5">
                        Opening Balance
                      </td>
                      <td className="border border-gray-300 px-1 py-0.5 text-right">
                        {data.totals.rice.openingRiceBalance.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-1 py-0.5">
                        Rice Lifted
                      </td>
                      <td className="border border-gray-300 px-1 py-0.5 text-right">
                        {data.totals.rice.totalRiceLifted.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-1 py-0.5">
                        Rice Available
                      </td>
                      <td className="border border-gray-300 px-1 py-0.5 text-right">
                        {data.totals.rice.totalRiceAvailable.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-1 py-0.5">
                        Rice Consumed
                      </td>
                      <td className="border border-gray-300 px-1 py-0.5 text-right">
                        {data.totals.rice.totalRiceConsumed.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="bg-gray-50 font-semibold">
                      <td className="border border-gray-300 px-1 py-0.5">
                        Closing Balance
                      </td>
                      <td className="border border-gray-300 px-1 py-0.5 text-right">
                        {data.totals.rice.closingRiceBalance.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Bottom: Total expenses */}
            <section className="grid gap-3 md:grid-cols-2">
              <div className="border border-gray-300 rounded-md p-2 text-[9px]">
                <h2 className="font-semibold mb-1 text-xs">
                  Total Expenses (Consolidated)
                </h2>
                <p>
                  Opening Balance: ₹
                  {data.totals.income.openingAmountBalance.toFixed(2)}
                </p>
                <p>
                  Total Received Amount: ₹
                  {data.totals.income.totalReceivedAmount.toFixed(2)}
                </p>
                <p>
                  Total Available Amount: ₹
                  {data.totals.income.totalAvailableAmount.toFixed(2)}
                </p>
                <p>
                  Total Expenditure: ₹
                  {data.totals.expenditure.totalExpenditure.toFixed(2)}
                </p>
                <p className="font-semibold">
                  Closing Balance: ₹
                  {data.totals.income.closingAmountBalance.toFixed(2)}
                </p>
              </div>

              <div className="border border-gray-300 rounded-md p-2 text-[9px]">
                <h2 className="font-semibold mb-1 text-xs">Summary</h2>
                <p>Total meals (all sections): {data.totals.meals.all}</p>
                <p>
                  Rice consumed in range:{' '}
                  {data.totals.rice.totalRiceConsumed.toFixed(2)} kg
                </p>
              </div>
            </section>
          </div>
        )}

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
