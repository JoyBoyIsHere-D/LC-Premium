'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import type {
  Question,
  CompanyData,
  TimeWindow,
  Difficulty,
  SortField,
  SortDirection,
} from '@/lib/types';

const TIME_WINDOWS: { key: TimeWindow; label: string }[] = [
  { key: '30d', label: '30 Days' },
  { key: '3m', label: '3 Months' },
  { key: '6m', label: '6 Months' },
  { key: '6m_plus', label: '6 Months+' },
  { key: 'all', label: 'All Time' },
];

const DIFFICULTIES: { key: Difficulty; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'EASY', label: 'Easy' },
  { key: 'MEDIUM', label: 'Medium' },
  { key: 'HARD', label: 'Hard' },
];

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const d = difficulty.toUpperCase();
  const styles = {
    EASY: 'text-easy bg-easy border-easy',
    MEDIUM: 'text-medium bg-medium border-medium',
    HARD: 'text-hard bg-hard border-hard',
  }[d] || 'text-gray-400 bg-gray-800 border-gray-700';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${styles}`}
    >
      {d.charAt(0) + d.slice(1).toLowerCase()}
    </span>
  );
}

function SortIcon({
  field,
  currentField,
  direction,
}: {
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
}) {
  if (field !== currentField) {
    return (
      <svg
        className="w-3.5 h-3.5 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    );
  }
  return (
    <svg
      className="w-3.5 h-3.5 text-indigo-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={direction === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
      />
    </svg>
  );
}

interface CompanyViewProps {
  data: CompanyData;
}

export default function CompanyView({ data }: CompanyViewProps) {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('all');
  const [difficulty, setDifficulty] = useState<Difficulty>('ALL');
  const [search, setSearch] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('frequency');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [topicSearch, setTopicSearch] = useState('');

  // Get all unique topics from current time window
  const allTopics = useMemo(() => {
    const questions = data.timeWindows[timeWindow] || [];
    const topics = new Set<string>();
    questions.forEach((q) => q.topics.forEach((t) => topics.add(t)));
    return [...topics].sort();
  }, [data, timeWindow]);

  const filteredTopics = useMemo(() => {
    if (!topicSearch.trim()) return allTopics;
    const q = topicSearch.toLowerCase();
    return allTopics.filter((t) => t.toLowerCase().includes(q));
  }, [allTopics, topicSearch]);

  const toggleTopic = useCallback((topic: string) => {
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) {
        next.delete(topic);
      } else {
        next.add(topic);
      }
      return next;
    });
  }, []);

  const clearTopics = useCallback(() => {
    setSelectedTopics(new Set());
  }, []);

  // Filter and sort questions
  const questions = useMemo(() => {
    let qs: Question[] = data.timeWindows[timeWindow] || [];

    // Filter by difficulty
    if (difficulty !== 'ALL') {
      qs = qs.filter((q) => q.difficulty === difficulty);
    }

    // Filter by search
    if (search.trim()) {
      const term = search.toLowerCase();
      qs = qs.filter((q) => q.title.toLowerCase().includes(term));
    }

    // Filter by topics
    if (selectedTopics.size > 0) {
      qs = qs.filter((q) =>
        [...selectedTopics].every((t) => q.topics.includes(t))
      );
    }

    // Sort
    qs = [...qs].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'difficulty': {
          const order = { EASY: 0, MEDIUM: 1, HARD: 2 };
          cmp =
            (order[a.difficulty] ?? 0) - (order[b.difficulty] ?? 0);
          break;
        }
        case 'frequency':
          cmp = a.frequency - b.frequency;
          break;
        case 'acceptance':
          cmp = a.acceptance - b.acceptance;
          break;
        default:
          cmp = a.id - b.id;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return qs;
  }, [data, timeWindow, difficulty, search, selectedTopics, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'title' ? 'asc' : 'desc');
    }
  };

  // Stats for current time window
  const stats = useMemo(() => {
    const all = data.timeWindows[timeWindow] || [];
    return {
      total: all.length,
      easy: all.filter((q) => q.difficulty === 'EASY').length,
      medium: all.filter((q) => q.difficulty === 'MEDIUM').length,
      hard: all.filter((q) => q.difficulty === 'HARD').length,
    };
  }, [data, timeWindow]);

  return (
    <div className="min-h-screen">
      {/* Top nav bar */}
      <nav className="sticky top-0 z-50 glass border-b border-gray-800/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors shrink-0"
            id="back-home"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium hidden sm:inline">
              All Companies
            </span>
          </Link>
          <div className="h-5 w-px bg-gray-800" />
          <h1 className="text-lg font-bold text-white truncate">
            {data.name}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:inline">
              {stats.total} problems
            </span>
            <div className="flex gap-1.5">
              <span className="text-xs font-medium text-easy bg-easy px-2 py-0.5 rounded-md border border-easy">
                {stats.easy}
              </span>
              <span className="text-xs font-medium text-medium bg-medium px-2 py-0.5 rounded-md border border-medium">
                {stats.medium}
              </span>
              <span className="text-xs font-medium text-hard bg-hard px-2 py-0.5 rounded-md border border-hard">
                {stats.hard}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Controls bar */}
      <div className="sticky top-14 z-40 bg-gray-950/90 backdrop-blur-sm border-b border-gray-800/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 space-y-3">
          {/* Row 1: Time window tabs */}
          <div className="flex flex-wrap gap-1.5">
            {TIME_WINDOWS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTimeWindow(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeWindow === key
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 border border-transparent'
                }`}
                id={`tw-${key}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Row 2: Search + Difficulty + Topics */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
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
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-900/60 border border-gray-800/60 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                id="question-search"
              />
            </div>

            {/* Difficulty pills */}
            <div className="flex gap-1">
              {DIFFICULTIES.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setDifficulty(key)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    difficulty === key
                      ? key === 'EASY'
                        ? 'bg-easy text-easy border border-easy'
                        : key === 'MEDIUM'
                          ? 'bg-medium text-medium border border-medium'
                          : key === 'HARD'
                            ? 'bg-hard text-hard border border-hard'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 border border-transparent'
                  }`}
                  id={`diff-${key.toLowerCase()}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Topic filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowTopicDropdown(!showTopicDropdown)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                  selectedTopics.size > 0
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 border-transparent'
                }`}
                id="topic-filter-btn"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Topics
                {selectedTopics.size > 0 && (
                  <span className="bg-purple-500/30 text-purple-200 px-1.5 py-0.5 rounded-full text-[10px] leading-none">
                    {selectedTopics.size}
                  </span>
                )}
              </button>

              {showTopicDropdown && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowTopicDropdown(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 z-50 w-72 max-h-80 bg-gray-900 border border-gray-700/60 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                    {/* Topic search */}
                    <div className="p-2 border-b border-gray-800/60">
                      <input
                        type="text"
                        placeholder="Filter topics..."
                        value={topicSearch}
                        onChange={(e) => setTopicSearch(e.target.value)}
                        className="w-full px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/40"
                        id="topic-search"
                      />
                    </div>
                    {/* Selected chips */}
                    {selectedTopics.size > 0 && (
                      <div className="p-2 border-b border-gray-800/60 flex flex-wrap gap-1">
                        {[...selectedTopics].map((t) => (
                          <button
                            key={t}
                            onClick={() => toggleTopic(t)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[11px] rounded-md hover:bg-purple-500/30 transition-colors"
                          >
                            {t}
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        ))}
                        <button
                          onClick={clearTopics}
                          className="text-[11px] text-gray-500 hover:text-gray-300 ml-1"
                        >
                          Clear all
                        </button>
                      </div>
                    )}
                    {/* Topic list */}
                    <div className="overflow-y-auto max-h-48 p-1">
                      {filteredTopics.map((topic) => (
                        <button
                          key={topic}
                          onClick={() => toggleTopic(topic)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                            selectedTopics.has(topic)
                              ? 'bg-purple-500/15 text-purple-300'
                              : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                                selectedTopics.has(topic)
                                  ? 'bg-purple-500/30 border-purple-500/50'
                                  : 'border-gray-600'
                              }`}
                            >
                              {selectedTopics.has(topic) && (
                                <svg
                                  className="w-2.5 h-2.5 text-purple-300"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </span>
                            {topic}
                          </span>
                        </button>
                      ))}
                      {filteredTopics.length === 0 && (
                        <p className="text-xs text-gray-500 px-3 py-4 text-center">
                          No topics found
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Questions table */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <div className="text-xs text-gray-500 mb-3">
          {questions.length === 0
            ? 'No questions match your filters'
            : `Showing ${questions.length} question${questions.length !== 1 ? 's' : ''}`}
        </div>

        <div className="rounded-xl border border-gray-800/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/80 text-left">
                  <th className="w-12 px-4 py-3">
                    <button
                      onClick={() => handleSort('id')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      #
                      <SortIcon
                        field="id"
                        currentField={sortField}
                        direction={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button
                      onClick={() => handleSort('title')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      Title
                      <SortIcon
                        field="title"
                        currentField={sortField}
                        direction={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="w-28 px-4 py-3">
                    <button
                      onClick={() => handleSort('difficulty')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      Difficulty
                      <SortIcon
                        field="difficulty"
                        currentField={sortField}
                        direction={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="w-28 px-4 py-3">
                    <button
                      onClick={() => handleSort('frequency')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      Frequency
                      <SortIcon
                        field="frequency"
                        currentField={sortField}
                        direction={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="w-28 px-4 py-3">
                    <button
                      onClick={() => handleSort('acceptance')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      Acceptance
                      <SortIcon
                        field="acceptance"
                        currentField={sortField}
                        direction={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400">
                    Topics
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {questions.map((q, idx) => (
                  <tr
                    key={`${q.title}-${idx}`}
                    className="group hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-gray-500 tabular-nums">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={q.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-200 hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5"
                      >
                        {q.title}
                        <svg
                          className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <DifficultyBadge difficulty={q.difficulty} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            style={{
                              width: `${Math.min(q.frequency, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 tabular-nums">
                          {q.frequency.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 tabular-nums">
                      {(q.acceptance * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {q.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="inline-flex px-1.5 py-0.5 bg-gray-800/60 text-gray-400 text-[11px] rounded-md border border-gray-700/40"
                          >
                            {topic}
                          </span>
                        ))}
                        {q.topics.length > 3 && (
                          <span className="inline-flex px-1.5 py-0.5 text-gray-500 text-[11px]">
                            +{q.topics.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {questions.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm">No questions match your current filters</p>
              <p className="text-xs text-gray-600 mt-1">
                Try adjusting your search, difficulty, or topic filters
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
