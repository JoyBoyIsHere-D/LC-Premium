# LC Premium

Company-wise LeetCode interview questions — browse **470+ companies** and **17,000+ problems**, sorted by frequency.

## Quick Start

```bash
cd site
npm install
npm run build-data   # Generate JSON from CSVs (first time only)
npm run dev           # http://localhost:3000
```

## Structure

```
LC-Premium/
├── leetcode-company-wise-problems-main/   # Raw CSV data (470 companies)
├── site/                                  # Next.js website
│   ├── scripts/build-data.js              # CSV → JSON build pipeline
│   ├── src/                               # App source code
│   └── public/data/                       # Generated JSON (gitignored)
└── README.md
```

See [`site/README.md`](site/README.md) for full documentation on the website, features, and deployment.

## Deploy

1. Push to GitHub
2. Import on [vercel.com](https://vercel.com) → set **Root Directory** to `site`
3. Vercel auto-builds and deploys on every push

## License

Data sourced from LeetCode. For educational and personal use.
