// src/app/page.tsx
'use client';

import React, { useState } from 'react';

type MealsFormState = {
  prePrimary: string;
  primary: string;
  middle: string;
};

export default function MealsReportPage() {
  const [form, setForm] = useState<MealsFormState>({
    prePrimary: '',
    primary: '',
    middle: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [existingId, setExistingId] = useState<string | null>(null);


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
    setExistingId(null); // new state

    try {
      const res = await fetch('/api/meals-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prePrimary: Number(form.prePrimary),
          primary: Number(form.primary),
          middle: Number(form.middle),
        }),
      });

      const data = await res.json();

      if (data.reason === 'already_exists') {
      // show message and store that we can update
      setMessage('Entry for today already exists. You can update it.');
      setExistingId(data.id);
      return;
    }

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Request failed');
      }

      setMessage('Mid day meal data saved for today.');
      setForm({ prePrimary: '', primary: '', middle: '' });
    } catch (err:unknown) {
      const msg = 
      err instanceof Error 
      ? err.message 
      : 'Failed to save data. Please try again.'
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-slate-900">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Mid Day Meal
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="prePrimary"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pre-primary meals
            </label>
            <input
              id="prePrimary"
              name="prePrimary"
              type="number"
              min={0}
              value={form.prePrimary}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="primary"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Primary meals
            </label>
            <input
              id="primary"
              name="primary"
              type="number"
              min={0}
              value={form.primary}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="middle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Middle meals
            </label>
            <input
              id="middle"
              name="middle"
              type="number"
              min={0}
              value={form.middle}
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
            {loading ? 'Saving...' : 'Save for today'}
          </button>
        </form>

        

          {message && (
  <p className="mt-4 text-center text-sm text-gray-700">
    {message}
  </p>
)}

{existingId && (
  <div className="mt-2 text-center">
    <button
      type="button"
      onClick={async () => {
        setLoading(true);
        try {
          const res = await fetch('/api/meals-entry', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prePrimary: Number(form.prePrimary),
              primary: Number(form.primary),
              middle: Number(form.middle),
            }),
          });
          const data = await res.json();
          if (!res.ok || !data.success) {
            throw new Error(data.error || 'Update failed');
          }
          setMessage('Today\'s entry updated successfully.');
          setExistingId(null);
        } catch (err: unknown) {
          const msg =
          err instanceof Error
          ? err.message 
          : 'Failed to update today\'s entry.'
          setMessage(msg);
        } finally {
          setLoading(false);
        }
      }}
      className="inline-flex items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-60"
      disabled={loading}
    >
      Update today&apos;s entry
    </button>
  </div>
)}



      </div>
    </main>
  );
}
