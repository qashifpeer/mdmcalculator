'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Meals Entry' },
  { href: '/monthly-report', label: 'Monthly Report' },
  { href: '/consolidated-report', label: 'Consolidated Report' },
  { href: '/income-report', label: 'Income & Rice Report' },
  { href: '/income-received', label: 'Income Entry' }, 
  { href: '/rice-received', label: 'Rice Entry' }, 
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-slate-900 text-slate-100 shadow-sm print:hidden">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6">
        <div className="flex h-12 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-wide">
              MDM Calculator
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2 py-1 rounded ${
                    active
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-md p-1 text-slate-200 hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden pb-2">
            <div className="flex flex-col gap-1 text-xs">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`px-2 py-1 rounded ${
                      active
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
