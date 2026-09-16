'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { CompanyIndex } from '@/lib/types';

interface CompanyGridProps {
  companies: CompanyIndex[];
  totalQuestions: number;
}

export default function CompanyGrid({
  companies,
  totalQuestions,
}: CompanyGridProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return companies;
    const q = search.toLowerCase();
    return companies.filter((c) => c.name.toLowerCase().includes(q));
  }, [companies, search]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-gray-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-gray-950 to-purple-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              {companies.length} Companies · {totalQuestions.toLocaleString()}{' '}
              Questions
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="gradient-text">LC Premium</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Company-wise LeetCode interview questions, sorted by frequency.
              Click any company to explore their most-asked problems.
            </p>

            {/* Search */}
            <div className="max-w-lg mx-auto mt-8">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search companies... (e.g. Google, Amazon, Meta)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200"
                    id="company-search"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No companies found matching &quot;{search}&quot;
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Showing {filtered.length} of {companies.length} companies
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map((company) => (
                <Link
                  key={company.slug}
                  href={`/company/${company.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-gray-800/60 bg-gray-900/40 hover:bg-gray-800/50 hover:border-gray-700/60 transition-all duration-200 p-4"
                  id={`company-${company.slug}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <h3 className="font-semibold text-gray-200 group-hover:text-white transition-colors truncate">
                      {company.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs font-medium text-indigo-400/80 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                        {company.questionCount} problems
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          Data sourced from LeetCode premium. Click any question to open it on{' '}
          <a
            href="https://leetcode.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:text-indigo-400 transition-colors"
          >
            leetcode.com
          </a>
        </div>
      </footer>
    </div>
  );
}
