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
    prePrimaryRice?: number;
    primaryRice?: number;
    middleRice?: number;
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
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to load monthly report.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Compute column totals for section tables
  const moneyTotals = data
    ? {
        opening:
          data.totals.sectionMoney.prePrimary.opening +
          data.totals.sectionMoney.primary.opening +
          data.totals.sectionMoney.middle.opening,
        income:
          data.totals.sectionMoney.prePrimary.income +
          data.totals.sectionMoney.primary.income +
          data.totals.sectionMoney.middle.income,
        available:
          data.totals.sectionMoney.prePrimary.available +
          data.totals.sectionMoney.primary.available +
          data.totals.sectionMoney.middle.available,
        expenditure:
          data.totals.sectionMoney.prePrimary.expenditure +
          data.totals.sectionMoney.primary.expenditure +
          data.totals.sectionMoney.middle.expenditure,
        closing:
          data.totals.sectionMoney.prePrimary.closing +
          data.totals.sectionMoney.primary.closing +
          data.totals.sectionMoney.middle.closing,
      }
    : null;

  const riceTotals = data
    ? {
        opening:
          data.totals.sectionRice.prePrimary.opening +
          data.totals.sectionRice.primary.opening +
          data.totals.sectionRice.middle.opening,
        lifted:
          data.totals.sectionRice.prePrimary.lifted +
          data.totals.sectionRice.primary.lifted +
          data.totals.sectionRice.middle.lifted,
        available:
          data.totals.sectionRice.prePrimary.available +
          data.totals.sectionRice.primary.available +
          data.totals.sectionRice.middle.available,
        consumed:
          data.totals.sectionRice.prePrimary.consumed +
          data.totals.sectionRice.primary.consumed +
          data.totals.sectionRice.middle.consumed,
        closing:
          data.totals.sectionRice.prePrimary.closing +
          data.totals.sectionRice.primary.closing +
          data.totals.sectionRice.middle.closing,
      }
    : null;

  return (
    <main className="min-h-screen bg-slate-100 py-6 px-3 flex flex-col items-center text-slate-900 print:bg-white print:p-0">
      {/* Screen Controls Bar */}
      <div className="w-full max-w-[210mm] bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-5 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              Mid Day Meals Monthly Report
            </h1>
            <p className="text-xs text-slate-500">
              A4 Print-Ready Consumption &amp; Stock Register
            </p>
          </div>
          {data && (
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              Print A4 Sheet
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-3 items-end"
        >
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {monthNames.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-24 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </form>

        {error && (
          <div className="mt-3 rounded border border-red-300 bg-red-50 px-3 py-2 text-xs font-medium text-red-800">
            {error}
          </div>
        )}
      </div>

      {/* A4 Sheet Container (210mm x 297mm) */}
      {data && (
        <div
          id="a4-report-sheet"
          className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-md border border-slate-300 px-[10mm] py-[7mm] flex flex-col justify-between tabular-nums print:w-[210mm] print:h-[297mm] print:min-h-0 print:max-w-none print:shadow-none print:border-none print:px-[8mm] print:py-[5mm] print:m-0"
        >
          <div className="space-y-2">
            {/* Institutional Header */}
            <header className="border-b-2 border-slate-800 pb-1.5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-wider font-semibold text-slate-600">
                  PM POSHAN (Mid Day Meal) — Monthly Consumption Register
                </p>
                <h2 className="text-[16px] font-extrabold tracking-tight text-slate-950 leading-tight">
                  GOVT UPS WARPORA
                </h2>
                <div className="flex items-center gap-4 mt-0.5 text-[10px]">
                  <span>
                    <span className="text-slate-600">Month:</span>{' '}
                    <strong className="font-bold uppercase">
                      {monthNames[data.month - 1]}
                    </strong>
                  </span>
                  <span>
                    <span className="text-slate-600">Year:</span>{' '}
                    <strong className="font-bold">{data.year}</strong>
                  </span>
                  <span>
                    <span className="text-slate-600">Feeding Days:</span>{' '}
                    <strong className="font-bold">{data.meals.length}</strong>
                  </span>
                </div>
              </div>

              {/* Active Ingredient Rates Box */}
              <div className="border border-slate-400 rounded px-2.5 py-1 bg-slate-50 text-[9px] leading-[1.35] shrink-0">
                <p className="font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-0.5 uppercase tracking-wide text-[8.5px]">
                  Cooking Cost Rates / Meal
                </p>
                <div className="grid grid-cols-2 gap-x-3">
                  <span className="text-slate-600">Pre-Primary:</span>
                  <span className="font-semibold text-right">
                    ₹{data.totals.rates.prePrimaryRate.toFixed(2)}
                  </span>
                  <span className="text-slate-600">Primary:</span>
                  <span className="font-semibold text-right">
                    ₹{data.totals.rates.primaryRate.toFixed(2)}
                  </span>
                  <span className="text-slate-600">Middle:</span>
                  <span className="font-semibold text-right">
                    ₹{data.totals.rates.middleRate.toFixed(2)}
                  </span>
                </div>
              </div>
            </header>

            {/* 1. Day-wise Meals Table (Sized for up to 26 rows on single A4) */}
            <section>
              <div className="flex items-center justify-between mb-0.5">
                <h3 className="text-[9.5px] font-bold uppercase tracking-wide text-slate-800">
                  1. Day-Wise Meals Served
                </h3>
                <span className="text-[8.5px] text-slate-500">
                  All figures in number of beneficiaries
                </span>
              </div>

              <table className="w-full border-collapse border border-slate-400 text-[9.5px] leading-[1.15]">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold">
                    <th className="border border-slate-400 px-1.5 py-[2.5px] text-center w-10">
                      S.No
                    </th>
                    <th className="border border-slate-400 px-2 py-[2.5px] text-left">
                      Date
                    </th>
                    <th className="border border-slate-400 px-2 py-[2.5px] text-right">
                      Pre-Primary
                    </th>
                    <th className="border border-slate-400 px-2 py-[2.5px] text-right">
                      Primary
                    </th>
                    <th className="border border-slate-400 px-2 py-[2.5px] text-right">
                      Middle
                    </th>
                    <th className="border border-slate-400 px-2 py-[2.5px] text-right bg-slate-200/70">
                      Daily Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.meals.map((m, idx) => {
                    const pp = m.prePrimary ?? 0;
                    const pri = m.primary ?? 0;
                    const mid = m.middle ?? 0;
                    const rowTotal = pp + pri + mid;

                    return (
                      <tr
                        key={`${m.date}-${idx}`}
                        className={idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}
                      >
                        <td className="border border-slate-300 px-1.5 py-[1.8px] text-center text-slate-600">
                          {idx + 1}
                        </td>
                        <td className="border border-slate-300 px-2 py-[1.8px] font-medium">
                          {m.date}
                        </td>
                        <td className="border border-slate-300 px-2 py-[1.8px] text-right">
                          {pp}
                        </td>
                        <td className="border border-slate-300 px-2 py-[1.8px] text-right">
                          {pri}
                        </td>
                        <td className="border border-slate-300 px-2 py-[1.8px] text-right">
                          {mid}
                        </td>
                        <td className="border border-slate-300 px-2 py-[1.8px] text-right font-semibold bg-slate-50">
                          {rowTotal}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-100 font-bold text-slate-950">
                    <td
                      className="border border-slate-400 px-2 py-[2.5px] text-right uppercase text-[9px]"
                      colSpan={2}
                    >
                      Total Meals Served
                    </td>
                    <td className="border border-slate-400 px-2 py-[2.5px] text-right">
                      {data.totals.meals.prePrimary}
                    </td>
                    <td className="border border-slate-400 px-2 py-[2.5px] text-right">
                      {data.totals.meals.primary}
                    </td>
                    <td className="border border-slate-400 px-2 py-[2.5px] text-right">
                      {data.totals.meals.middle}
                    </td>
                    <td className="border border-slate-400 px-2 py-[2.5px] text-right bg-slate-200/80">
                      {data.totals.meals.all}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* 2. Section-Wise Cooking Cost (Ingredients) */}
            <section>
              <h3 className="text-[9.5px] font-bold uppercase tracking-wide text-slate-800 mb-0.5">
                2. Section-Wise Cooking Cost Account (₹)
              </h3>
              <table className="w-full border-collapse border border-slate-400 text-[9.5px] leading-[1.2]">
                <thead>
                  <tr className="bg-slate-100 font-bold text-slate-900">
                    <th className="border border-slate-400 px-2 py-[2.5px] text-left">
                      Section
                    </th>
                    <th className="border border-slate-400 px-2 py-[2.5px] text-right">
                      Opening (₹)
                    </th>
                    <th className="border border-slate-400 px-2 py-[2.5px] text-right">
                      Received (₹)
                    </th>
                    <th className="border border-slate-400 px-2 py-[2.5px] text-right">
                      Available (₹)
                    </th>
                    <th className="border border-slate-400 px-2 py-[2.5px] text-right">
                      Expenditure (₹)
                    </th>
                    <th className="border border-slate-400 px-2 py-[2.5px] text-right">
                      Closing Bal. (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(['prePrimary', 'primary', 'middle'] as const).map((key) => {
                    const row = data.totals.sectionMoney[key];
                    const label =
                      key === 'prePrimary'
                        ? 'Pre-Primary'
                        : key === 'primary'
                        ? 'Primary'
                        : 'Middle';
                    return (
                      <tr key={key}>
                        <td className="border border-slate-300 px-2 py-[2px] font-medium">
                          {label}
                        </td>
                        <td className="border border-slate-300 px-2 py-[2px] text-right">
                          {row.opening.toFixed(2)}
                        </td>
                        <td className="border border-slate-300 px-2 py-[2px] text-right">
                          {row.income.toFixed(2)}
                        </td>
                        <td className="border border-slate-300 px-2 py-[2px] text-right">
                          {row.available.toFixed(2)}
                        </td>
                        <td className="border border-slate-300 px-2 py-[2px] text-right">
                          {row.expenditure.toFixed(2)}
                        </td>
                        <td className="border border-slate-300 px-2 py-[2px] text-right font-semibold">
                          {row.closing.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                  {moneyTotals && (
                    <tr className="bg-slate-100 font-bold text-slate-950">
                      <td className="border border-slate-400 px-2 py-[2.5px]">
                        Total (₹)
                      </td>
                      <td className="border border-slate-400 px-2 py-[2.5px] text-right">
                        {moneyTotals.opening.toFixed(2)}
                      </td>
                      <td className="border border-slate-400 px-2 py-[2.5px] text-right">
                        {moneyTotals.income.toFixed(2)}
                      </td>
                      <td className="border border-slate-400 px-2 py-[2.5px] text-right">
                        {moneyTotals.available.toFixed(2)}
                      </td>
                      <td className="border border-slate-400 px-2 py-[2.5px] text-right">
                        {moneyTotals.expenditure.toFixed(2)}
                      </td>
                      <td className="border border-slate-400 px-2 py-[2.5px] text-right">
                        {moneyTotals.closing.toFixed(2)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>

            {/* 3. Section-Wise Rice Stock Account */}
            <section>
              <h3 className="text-[9.5px] font-bold uppercase tracking-wide text-slate-800 mb-0.5">
                3. Section-Wise Rice Stock Account (kg)
              </h3>
              <table className="w-full border-collapse border border-slate-400 text-[9.5px] leading-[1.2]">
                <thead>
                  <tr className="bg-slate-100 font-bold text-slate-900">
                    <th className="border border-slate-400 px-2 py-[2.5px] text-left">
                      Section
                    </th>
                    <th className="border border-slate-400 px-2 py-[2.5px] text-right">
                      Opening (kg)
                    </th>
                    <th className="border border-slate-400 px-2 py-[2.5px] text-right">
                      Lifted (kg)
                    </th>
                    <th className="border border-slate-400 px-2 py-[2.5px] text-right">
                      Available (kg)
                    </th>
                    <th className="border border-slate-400 px-2 py-[2.5px] text-right">
                      Consumed (kg)
                    </th>
                    <th className="border border-slate-400 px-2 py-[2.5px] text-right">
                      Closing Bal. (kg)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(['prePrimary', 'primary', 'middle'] as const).map((key) => {
                    const row = data.totals.sectionRice[key];
                    const label =
                      key === 'prePrimary'
                        ? 'Pre-Primary'
                        : key === 'primary'
                        ? 'Primary'
                        : 'Middle';
                    return (
                      <tr key={key}>
                        <td className="border border-slate-300 px-2 py-[2px] font-medium">
                          {label}
                        </td>
                        <td className="border border-slate-300 px-2 py-[2px] text-right">
                          {row.opening.toFixed(2)}
                        </td>
                        <td className="border border-slate-300 px-2 py-[2px] text-right">
                          {row.lifted.toFixed(2)}
                        </td>
                        <td className="border border-slate-300 px-2 py-[2px] text-right">
                          {row.available.toFixed(2)}
                        </td>
                        <td className="border border-slate-300 px-2 py-[2px] text-right">
                          {row.consumed.toFixed(2)}
                        </td>
                        <td className="border border-slate-300 px-2 py-[2px] text-right font-semibold">
                          {row.closing.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                  {riceTotals && (
                    <tr className="bg-slate-100 font-bold text-slate-950">
                      <td className="border border-slate-400 px-2 py-[2.5px]">
                        Total (kg)
                      </td>
                      <td className="border border-slate-400 px-2 py-[2.5px] text-right">
                        {riceTotals.opening.toFixed(2)}
                      </td>
                      <td className="border border-slate-400 px-2 py-[2.5px] text-right">
                        {riceTotals.lifted.toFixed(2)}
                      </td>
                      <td className="border border-slate-400 px-2 py-[2.5px] text-right">
                        {riceTotals.available.toFixed(2)}
                      </td>
                      <td className="border border-slate-400 px-2 py-[2.5px] text-right">
                        {riceTotals.consumed.toFixed(2)}
                      </td>
                      <td className="border border-slate-400 px-2 py-[2.5px] text-right">
                        {riceTotals.closing.toFixed(2)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>

            {/* 4. Consolidated Grand Summary */}
            <section className="grid grid-cols-2 gap-2.5 pt-0.5 text-[9.5px]">
              {/* Consolidated Money Box */}
              <div className="border border-slate-400 rounded p-2 bg-slate-50/70">
                <h4 className="font-bold uppercase text-[9px] text-slate-800 border-b border-slate-300 pb-0.5 mb-1">
                  Consolidated Cooking Cost Summary
                </h4>
                <div className="space-y-0.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Opening Balance:</span>
                    <span className="font-medium">
                      ₹{data.totals.income.openingAmountBalance.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Received (Month):</span>
                    <span className="font-medium">
                      ₹{data.totals.income.totalReceivedAmountCurrent.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Expenditure (Month):</span>
                    <span className="font-medium">
                      ₹
                      {data.totals.expenditure.totalExpenditureCurrent.toFixed(
                        2
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-300 pt-0.5 font-bold text-slate-950">
                    <span>Closing Balance:</span>
                    <span>
                      ₹{data.totals.income.closingAmountBalance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Consolidated Rice Box */}
              <div className="border border-slate-400 rounded p-2 bg-slate-50/70">
                <h4 className="font-bold uppercase text-[9px] text-slate-800 border-b border-slate-300 pb-0.5 mb-1">
                  Consolidated Rice Stock Summary
                </h4>
                <div className="space-y-0.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Opening Stock:</span>
                    <span className="font-medium">
                      {data.totals.rice.openingRiceBalance.toFixed(2)} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Lifted (Month):</span>
                    <span className="font-medium">
                      {data.totals.rice.totalRiceLiftedCurrent.toFixed(2)} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Consumed (Month):</span>
                    <span className="font-medium">
                      {data.totals.rice.totalRiceConsumedCurrent.toFixed(2)} kg
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-300 pt-0.5 font-bold text-slate-950">
                    <span>Closing Stock:</span>
                    <span>
                      {data.totals.rice.closingRiceBalance.toFixed(2)} kg
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Official Signature Footer */}
          <footer className="pt-5 mt-2 flex items-end justify-between text-[9.5px] text-slate-800">
            <div className="text-center">
              <div className="w-40 border-b border-slate-600 mb-1" />
              <p className="font-semibold">MDM Incharge / Teacher</p>
            </div>
            <div className="text-[8.5px] text-slate-500">
              GOVT UPS WARPORA • {monthNames[data.month - 1]} {data.year}
            </div>
            <div className="text-center">
              <div className="w-44 border-b border-slate-600 mb-1" />
              <p className="font-semibold">Headmaster / DDO Seal &amp; Sign</p>
            </div>
          </footer>
        </div>
      )}

      {/* Strict Single-Page A4 Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 5mm 6mm;
          }
          html,
          body {
            width: 210mm;
            height: 297mm;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          #a4-report-sheet {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          table,
          tr,
          section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
    </main>
  );
}