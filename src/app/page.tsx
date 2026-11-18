'use client';

import React, { useState, useEffect, useCallback } from 'react';

type MealsFormState = {
  prePrimary: string;
  primary: string;
  middle: string;
};

type MealEntryRecord = {
  _id: string;
  date: string; // YYYY-MM-DD
  prePrimary: number;
  primary: number;
  middle: number;
};

type StatusMessage = {
  text: string;
  type: 'success' | 'error';
};

export default function MealsReportPage() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [entriesMap, setEntriesMap] = useState<Record<string, MealEntryRecord>>({});
  const [fetchingMonth, setFetchingMonth] = useState(false);

  // Selection & UI flow state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const [form, setForm] = useState<MealsFormState>({
    prePrimary: '',
    primary: '',
    middle: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<StatusMessage | null>(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

  // Fetch all entries for the displayed month
  const fetchMonthEntries = useCallback(async () => {
    setFetchingMonth(true);
    try {
      const res = await fetch(`/api/meals-entry?month=${monthPrefix}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not load monthly meal records.');
      }
      if (Array.isArray(data.entries)) {
        const mapped: Record<string, MealEntryRecord> = {};
        data.entries.forEach((entry: MealEntryRecord) => {
          if (entry.date) {
            mapped[entry.date] = entry;
          }
        });
        setEntriesMap(mapped);
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to load calendar data. Please refresh.';
      setMessage({ text: msg, type: 'error' });
    } finally {
      setFetchingMonth(false);
    }
  }, [monthPrefix]);

  useEffect(() => {
    fetchMonthEntries();
  }, [fetchMonthEntries]);

  // Calendar grid helpers
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthName = currentMonth.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const formatDateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const resetSelection = () => {
    setSelectedDate(null);
    setShowUpdatePrompt(false);
    setIsFormVisible(false);
    setIsUpdateMode(false);
    setMessage(null);
    setForm({ prePrimary: '', primary: '', middle: '' });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
    resetSelection();
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
    resetSelection();
  };

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setMessage(null);
    const existing = entriesMap[dateStr];

    if (existing) {
      setShowUpdatePrompt(true);
      setIsFormVisible(false);
      setIsUpdateMode(true);
      setForm({
        prePrimary: String(existing.prePrimary ?? 0),
        primary: String(existing.primary ?? 0),
        middle: String(existing.middle ?? 0),
      });
    } else {
      setShowUpdatePrompt(false);
      setIsFormVisible(true);
      setIsUpdateMode(false);
      setForm({ prePrimary: '', primary: '', middle: '' });
    }
  };

  const handleConfirmUpdate = () => {
    setShowUpdatePrompt(false);
    setIsFormVisible(true);
  };

  const handleCancelUpdate = () => {
    setShowUpdatePrompt(false);
    setSelectedDate(null);
    setMessage({
      text: 'Update cancelled. Existing meal entry was not modified.',
      type: 'error',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDate) return;

    setLoading(true);
    setMessage(null);

    try {
      const existing = entriesMap[selectedDate];
      const method = isUpdateMode && existing ? 'PUT' : 'POST';

      const res = await fetch('/api/meals-entry', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existing?._id,
          date: selectedDate,
          prePrimary: Number(form.prePrimary),
          primary: Number(form.primary),
          middle: Number(form.middle),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not save meal entry. Please try again.');
      }

      setMessage({
        text: isUpdateMode
          ? `Successfully updated Mid Day Meal entry for ${selectedDate}.`
          : `Successfully saved Mid Day Meal entry for ${selectedDate}.`,
        type: 'success',
      });

      await fetchMonthEntries();
      setIsUpdateMode(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Entry not saved. Please check your connection and try again.';
      setMessage({ text: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-slate-900">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-2 text-center">
          Mid Day Meal
        </h1>
        <p className="text-xs text-center text-gray-500 mb-5">
          Select a date to report or update meals
        </p>

        {/* Month Navigation Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
          >
            &larr; Prev
          </button>
          <span className="font-semibold text-base">{monthName}</span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
          >
            Next &rarr;
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 text-xs mb-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" />
            Reported
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" />
            Not Reported
          </span>
        </div>

        {/* Calendar Grid */}
        {fetchingMonth ? (
          <div className="py-10 text-center text-sm text-gray-500">
            Loading calendar...
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1.5 text-center mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div
                key={d}
                className="text-xs font-medium text-gray-500 py-1"
              >
                {d}
              </div>
            ))}

            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dateStr = formatDateStr(day);
              const hasEntry = Boolean(entriesMap[dateStr]);
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => handleDateClick(dateStr)}
                  className={`py-2.5 rounded-md text-sm font-medium transition border ${
                    hasEntry
                      ? 'bg-green-100 text-green-900 border-green-400 hover:bg-green-200'
                      : 'bg-red-100 text-red-900 border-red-300 hover:bg-red-200'
                  } ${isSelected ? 'ring-2 ring-blue-600 ring-offset-1' : ''}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        )}

        {/* Confirmation Prompt when clicking an already reported day */}
        {showUpdatePrompt && selectedDate && (
          <div className="p-4 rounded-md bg-amber-50 border border-amber-300 text-center space-y-3 mb-4">
            <p className="text-sm font-medium text-amber-900">
              You have already reported for the day ({selectedDate}), would you want to update it?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleConfirmUpdate}
                className="rounded-md bg-orange-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-orange-700"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={handleCancelUpdate}
                className="rounded-md bg-gray-200 px-4 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-300"
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Meals Entry Form */}
        {isFormVisible && selectedDate && (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 border-t border-gray-200 pt-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">
                {isUpdateMode ? 'Update Entry' : 'New Entry'} — {selectedDate}
              </h2>
              <button
                type="button"
                onClick={resetSelection}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>

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
              className={`w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
                isUpdateMode
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading
                ? 'Saving...'
                : isUpdateMode
                ? `Update entry for ${selectedDate}`
                : `Save for ${selectedDate}`}
            </button>
          </form>
        )}

        {/* Styled Status Banner (Green when done, Red when not done/failed) */}
        {message && (
          <div
            role="status"
            className={`mt-4 flex items-center justify-between gap-2 rounded-md border px-4 py-3 text-sm font-medium shadow-sm ${
              message.type === 'success'
                ? 'bg-green-100 border-green-400 text-green-900'
                : 'bg-red-100 border-red-400 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">
                {message.type === 'success' ? '✓' : '✕'}
              </span>
              <span>{message.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setMessage(null)}
              aria-label="Dismiss message"
              className="text-xs opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </main>
  );
}