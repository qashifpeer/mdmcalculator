// src/app/meals-import/page.tsx
'use client';


import React, { useState } from 'react';
import Papa from 'papaparse';

type MealRow = {
  date: string;
  prePrimary: number;
  primary: number;
  middle: number;
};

type RawMealRow = {
  Date?: string;
  date?: string;
  PrePrimary?: string;
  prePrimary?: string;
  Primary?: string;
  primary?: string;
  Middle?: string;
  middle?: string;
};

export default function MealsImportPage() {
  const [rows, setRows] = useState<MealRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage(null);
    setRows([]);

    Papa.parse<RawMealRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: Papa.ParseResult<RawMealRow>) => {
        const parsed: MealRow[] = [];

        for (const r of result.data) {
          const rawDate = r.Date ?? r.date ?? '';
          const date = rawDate.toString().slice(0, 10);
          if (!date) continue;

          parsed.push({
            date,
            prePrimary: Number(r.PrePrimary ?? r.prePrimary ?? 0),
            primary: Number(r.Primary ?? r.primary ?? 0),
            middle: Number(r.Middle ?? r.middle ?? 0),
          });
        }

        setRows(parsed);
        setMessage(`Parsed ${parsed.length} rows. Ready to import.`);
      },
      error: (err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Unknown parse error';
        setMessage(msg);
      },
    });

  };

  const handleImport = async () => {
    if (rows.length === 0) {
      setMessage('No rows to import.');
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/meals-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Import failed');
      }
      setMessage(`Imported ${data.count} entries successfully.`);
      setRows([]);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Import failed. Please try again.';
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-slate-900">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Import Meals Entries (CSV)
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload CSV file
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Expected columns: Date, PrePrimary, Primary, Middle
            </p>
          </div>

          {rows.length > 0 && (
            <p className="text-xs text-gray-700">
              Preview first row: {rows[0].date} – Pre: {rows[0].prePrimary}, Pri:{' '}
              {rows[0].primary}, Mid: {rows[0].middle}
            </p>
          )}

          <button
            type="button"
            onClick={handleImport}
            disabled={loading || rows.length === 0}
            className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Importing...' : 'Import to Sanity'}
          </button>

          {message && (
            <p className="mt-2 text-center text-sm text-gray-700">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
