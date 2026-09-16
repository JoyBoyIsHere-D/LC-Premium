# LC Premium — Company-Wise LeetCode Problems

Browse **17,316 LeetCode interview questions** across **470+ companies**, sorted by frequency. Filter by difficulty, topic, and time window — click any question to open it on LeetCode.

## Features

- **Company Search** — Find any company instantly from the home page
- **Time Window Tabs** — 30 Days · 3 Months · 6 Months · 6 Months+ · All Time
- **Difficulty Filter** — Easy / Medium / Hard pill buttons
- **Topic Filter** — Multi-select dropdown with search (Array, DP, Trees, etc.)
- **Question Search** — Live text filter by problem name
- **Sortable Columns** — Sort by title, difficulty, frequency, or acceptance rate
- **LeetCode Links** — Every question links directly to leetcode.com

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, SSG) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Data | Build-time CSV → JSON pipeline |
| Hosting | [Vercel](https://vercel.com/) (free tier) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm

### Install & Run

```bash
# Install dependencies
npm install

# Generate JSON data from CSVs (required on first run)
npm run build-data

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build-data` | Convert CSVs → JSON in `public/data/` |
| `npm run build` | Full production build (data + Next.js) |
| `npm run start` | Serve the production build locally |

## Project Structure

```
site/
├── scripts/
│   └── build-data.js         # CSV → JSON build pipeline
├── public/
│   └── data/                  # Generated JSON (470 company files + index)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (Inter font, dark mode)
│   │   ├── globals.css        # Tailwind + custom utilities
│   │   ├── page.tsx           # Home page (company grid)
│   │   └── company/
│   │       └── [slug]/
│   │           └── page.tsx   # Company detail page (SSG)
│   ├── components/
│   │   ├── CompanyGrid.tsx    # Home: hero + search + company cards
│   │   └── CompanyView.tsx    # Detail: question table + filters
│   └── lib/
│       ├── types.ts           # TypeScript type definitions
│       └── data.ts            # Server-side data readers
└── package.json
```

## Data Source

CSV data lives in `../leetcode-company-wise-problems-main/`. Each company folder contains 5 CSVs:

| File | Time Window |
|---|---|
| `1. Thirty Days.csv` | Last 30 days |
| `2. Three Months.csv` | Last 3 months |
| `3. Six Months.csv` | Last 6 months |
| `4. More Than Six Months.csv` | Older than 6 months |
| `5. All.csv` | All time (superset) |

**CSV schema:** `Difficulty, Title, Frequency, Acceptance Rate, Link, Topics`

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo
3. Vercel auto-detects Next.js — the `build` script already runs `build-data` first
4. Every `git push` to `main` triggers an automatic production deploy

## License

Data sourced from LeetCode. This project is for educational and personal use.
