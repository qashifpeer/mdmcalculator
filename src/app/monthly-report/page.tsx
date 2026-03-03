// src/app/monthly-report/page.tsx
'use client';

import React, { useState } from 'react';

type MealsRow = {
  date: string;
  prePrimary?: number;
  primary?: number;
  middle?: number;
};

type SectionMoneyRow = {
  opening: number;
  income: number;
  available: number;
  expenditure: number;
  closing: number;
};

type SectionRiceRow = {
  opening: number;
  lifted: number;
  available: number;
  consumed: number;
  closing: number;
};

type Totals = {
  meals: {
    prePrimary: number;
    primary: number;
    middle: number;
    all: number;
  };
  income: {
    totalReceivedAmountCurrent: number;
    openingAmountBalance: number;
    closingAmountBalance: number;
  };
  expenditure: {
    prePrimary: number;
    primary: number;
    middle: number;
    totalExpenditureCurrent: number;
  };
  rice: {
    totalRiceLiftedCurrent: number;
    totalRiceConsumedCurrent: number;
    openingRiceBalance: number;
    closingRiceBalance: number;
    totalRiceAvailableCurrent: number;
    riceConsumedPre: number;
    riceConsumedPri: number;
    riceConsumedMid: number;
  };
  rates: {
    prePrimaryRate: number;
    primaryRate: number;
    middleRate: number;
  };
  sectionMoney: {
    prePrimary: SectionMoneyRow;
    primary: SectionMoneyRow;
    middle: SectionMoneyRow;
  };
  sectionRice: {
    prePrimary: SectionRiceRow;
    primary: SectionRiceRow;
    middle: SectionRiceRow;
  };
};

type ApiResponse = {
  success: boolean;
  month: number;
  year: number;
  meals: MealsRow[];
  totals: Totals;
};

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function MonthlyReportPage() {
  const [year, setYear] = useState<number>(() => new Date().getFullYear());
  const [month, setMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch('/api/monthly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, month }),
      });

      const json = (await res.json()) as ApiResponse & { error?: string };
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Request failed');
      }
      setData(json);
    } catch (err : unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to load monthly report.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-4 md:p-6 print:p-3 print:shadow-none">
        {/* Controls */}
        <div className="print:hidden">
          <h1 className="text-2xl font-semibold text-center mb-2">
            Mid Day Meals Monthly Report
          </h1>
          <p className="text-center text-sm text-gray-600 mb-4">
            Select a month and year to generate report
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-4 items-end justify-center mb-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="rounded-md border border-gray-300 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {monthNames.map((m, idx) => (
                  <option key={m} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-24 rounded-md border border-gray-300 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <p className="text-center text-sm text-red-600 mb-4">{error}</p>
          )}
        </div>

        {/* Report content */}
        {data && (
          <div className="space-y-3 text-[10px] leading-tight print:text-[9px]">
            {/* Header row */}
            <div className="flex justify-between gap-2">
              <div className="mb-1">
                <p className="font-semibold text-xs text-center w-full">
                  Mid Day Meals Consumption Register
                </p>
                <p className="font-semibold text-lg text-center w-full">
                  GOVT UPS WARPORA
                </p>
                <p>
                  <span className="font-medium">Month:</span><span className='font-bold text-xs'>{monthNames[data.month - 1]}</span>
                  
                </p>
                <p>
                  <span className="font-medium">Year:</span> {data.year}
                </p>
              </div>
              <div className="text-right text-[9px]">
                <p className="font-bold mb-0.5">Ingredient Rates</p>
                <p className='text-xs'>
                  Pre-Primary: ₹{data.totals.rates.prePrimaryRate.toFixed(2)}
                </p>
                <p className='text-xs'>Primary: ₹{data.totals.rates.primaryRate.toFixed(2)}</p>
                <p className='text-xs'>Middle: ₹{data.totals.rates.middleRate.toFixed(2)}</p>
              </div>
            </div>

            {/* Meals report (day-wise) */}
            <section>
              <h2 className="font-semibold mb-1 text-[9px]">Meals Report</h2>
              <div className="border border-gray-300">
                <table className="w-full text-[9px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-1 py-0.5 text-left">
                        S.No
                      </th>
                      <th className="border border-gray-300 px-1 py-0.5 text-left">
                        Date
                      </th>
                      <th className="border border-gray-300 px-1 py-0.5 text-right">
                        Pre-Primary
                      </th>
                      <th className="border border-gray-300 px-1 py-0.5 text-right">
                        Primary
                      </th>
                      <th className="border border-gray-300 px-1 py-0.5 text-right">
                        Middle
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.meals.map((m, idx) => (
                      <tr key={`${m.date}-${idx}`}>
                        <td className="border border-gray-300 px-1 py-0.5">
                          {idx + 1}
                        </td>
                        <td className="border border-gray-300 px-1 py-0.5">
                          {m.date}
                        </td>
                        <td className="border border-gray-300 px-1 py-0.5 text-right">
                          {m.prePrimary ?? 0}
                        </td>
                        <td className="border border-gray-300 px-1 py-0.5 text-right">
                          {m.primary ?? 0}
                        </td>
                        <td className="border border-gray-300 px-1 py-0.5 text-right">
                          {m.middle ?? 0}
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
                        {data.totals.meals.prePrimary}
                      </td>
                      <td className="border border-gray-300 px-1 py-0.5 text-right">
                        {data.totals.meals.primary}
                      </td>
                      <td className="border border-gray-300 px-1 py-0.5 text-right">
                        {data.totals.meals.middle}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Ingredients per section */}
            <section className="mt-2">
              <h2 className="font-semibold mb-1 text-[10px]">Ingredients</h2>
              <div className="border border-gray-200">
                <table className="w-full text-[10px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-1 py-0.5 text-left font-medium text-gray-700">
                        Section
                      </th>
                      <th className="px-1 py-0.5 text-right font-medium text-gray-700">
                        Opening (₹)
                      </th>
                      <th className="px-1 py-0.5 text-right font-medium text-gray-700">
                        Income (₹)
                      </th>
                      <th className="px-1 py-0.5 text-right font-medium text-gray-700">
                        Avl (₹)
                      </th>
                      <th className="px-1 py-0.5 text-right font-medium text-gray-700">
                        Exp. (₹)
                      </th>
                      <th className="px-1 py-0.5 text-right font-medium text-gray-700">
                        Bal. (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(['prePrimary', 'primary', 'middle'] as const).map(
                      (key) => {
                        const row = data.totals.sectionMoney[key];
                        const label =
                          key === 'prePrimary'
                            ? 'Pre-Primary'
                            : key === 'primary'
                            ? 'Primary'
                            : 'Middle';
                        return (
                          <tr key={key}>
                            <td className="px-1 py-0.5">{label}</td>
                            <td className="px-1 py-0.5 text-right">
                              {row.opening.toFixed(2)}
                            </td>
                            <td className="px-1 py-0.5 text-right">
                              {row.income.toFixed(2)}
                            </td>
                            <td className="px-1 py-0.5 text-right">
                              {row.available.toFixed(2)}
                            </td>
                            <td className="px-1 py-0.5 text-right">
                              {row.expenditure.toFixed(2)}
                            </td>
                            <td className="px-1 py-0.5 text-right">
                              {row.closing.toFixed(2)}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Rice per section */}
            <section className="mt-2">
              <h2 className="font-semibold mb-1 text-[10px]">Rice Details</h2>
              <div className="border border-gray-200">
                <table className="w-full text-[10px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-1 py-0.5 text-left font-medium text-gray-700">
                        Section
                      </th>
                      <th className="px-1 py-0.5 text-right font-medium text-gray-700">
                        Opening (kg)
                      </th>
                      <th className="px-1 py-0.5 text-right font-medium text-gray-700">
                        Lifted (kg)
                      </th>
                      <th className="px-1 py-0.5 text-right font-medium text-gray-700">
                        Avl (kg)
                      </th>
                      <th className="px-1 py-0.5 text-right font-medium text-gray-700">
                        Consumed (kg)
                      </th>
                      <th className="px-1 py-0.5 text-right font-medium text-gray-700">
                        Bal. (kg)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(['prePrimary', 'primary', 'middle'] as const).map(
                      (key) => {
                        const row = data.totals.sectionRice[key];
                        const label =
                          key === 'prePrimary'
                            ? 'Pre-Primary'
                            : key === 'primary'
                            ? 'Primary'
                            : 'Middle';
                        return (
                          <tr key={key}>
                            <td className="px-1 py-0.5">{label}</td>
                            <td className="px-1 py-0.5 text-right">
                              {row.opening.toFixed(2)}
                            </td>
                            <td className="px-1 py-0.5 text-right">
                              {row.lifted.toFixed(2)}
                            </td>
                            <td className="px-1 py-0.5 text-right">
                              {row.available.toFixed(2)}
                            </td>
                            <td className="px-1 py-0.5 text-right">
                              {row.consumed.toFixed(2)}
                            </td>
                            <td className="px-1 py-0.5 text-right">
                              {row.closing.toFixed(2)}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Bottom: Total expenses + total rice */}
            <section className="grid gap-2 grid-cols-1 md:grid-cols-2 print:grid-cols-2 text-[12px]">
              {/* Money */}
              <div className="border border-gray-200 rounded-md p-2">
                <h2 className="font-semibold mb-1 text-[12px]">
                  Total Expenses
                </h2>
                <p>
                  Opening: ₹
                  {data.totals.income.openingAmountBalance.toFixed(2)}
                </p>
                <p>
                  Received (month): ₹
                  {data.totals.income.totalReceivedAmountCurrent.toFixed(2)}
                </p>
                <p>
                  Expenditure (month): ₹
                  {data.totals.expenditure.totalExpenditureCurrent.toFixed(2)}
                </p>
                <p className="font-semibold">
                  Closing: ₹
                  {data.totals.income.closingAmountBalance.toFixed(2)}
                </p>
              </div>

              {/* Rice */}
              <div className="border border-gray-200 rounded-md p-2">
                <h2 className="font-semibold mb-1 text-[10px]">Total Rice</h2>
                <p>
                  Opening:{' '}
                  {data.totals.rice.openingRiceBalance.toFixed(2)} kg
                </p>
                <p>
                  Lifted (month):{' '}
                  {data.totals.rice.totalRiceLiftedCurrent.toFixed(2)} kg
                </p>
                <p>
                  Consumed (month):{' '}
                  {data.totals.rice.totalRiceConsumedCurrent.toFixed(2)} kg
                </p>
                <p className="font-semibold">
                  Closing:{' '}
                  {data.totals.rice.closingRiceBalance.toFixed(2)} kg
                </p>
              </div>
            </section>
          </div>
        )}

        {/* Print styles */}
        <style jsx global>{`
          @media print {
            @page {
              size: A4;
              margin: 8mm;
            }
            html,
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              font-size: 11px;
            }
            .print\\:grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
            table th,
            table td {
              padding-top: 2px !important;
              padding-bottom: 2px !important;
            }
            h1,
            h2,
            p {
              margin-block: 2px !important;
            }
          }
        `}</style>
      </div>
    </main>
  );
}
