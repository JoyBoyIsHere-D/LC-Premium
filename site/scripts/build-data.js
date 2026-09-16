const fs = require('fs');
const path = require('path');

// Path to the CSV data
const DATA_DIR = path.resolve(__dirname, '../../leetcode-company-wise-problems-main');
const OUTPUT_DIR = path.resolve(__dirname, '../public/data');

// CSV filename → key mapping
const FILE_MAP = {
  '1. Thirty Days.csv': '30d',
  '2. Three Months.csv': '3m',
  '3. Six Months.csv': '6m',
  '4. More Than Six Months.csv': '6m_plus',
  '5. All.csv': 'all',
};

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter((l) => l.trim());
    if (lines.length <= 1) return [];

    // Skip header: Difficulty,Title,Frequency,Acceptance Rate,Link,Topics
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (cols.length < 6) continue;

      const [difficulty, title, frequency, acceptance, link, ...topicParts] = cols;
      const topics = topicParts
        .join(',')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      rows.push({
        id: i,
        title: title || '',
        difficulty: (difficulty || '').toUpperCase(),
        frequency: parseFloat(frequency) || 0,
        acceptance: parseFloat(acceptance) || 0,
        link: link || '',
        topics: topics.length > 0 ? topics : [],
      });
    }
    return rows;
  } catch {
    return [];
  }
}

function main() {
  console.log('📦 Building data from CSVs...');
  console.log(`   Source: ${DATA_DIR}`);
  console.log(`   Output: ${OUTPUT_DIR}`);

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Read all company directories
  const entries = fs.readdirSync(DATA_DIR, { withFileTypes: true });
  const companies = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  console.log(`   Found ${companies.length} companies`);

  const index = [];
  let totalQuestions = 0;

  for (const company of companies) {
    const companyDir = path.join(DATA_DIR, company);
    const slug = slugify(company);
    const companyData = { name: company, slug, timeWindows: {} };

    let companyQuestionCount = 0;
    const allTopics = new Set();

    for (const [fileName, key] of Object.entries(FILE_MAP)) {
      const filePath = path.join(companyDir, fileName);
      const questions = parseCSV(filePath);

      // Sort by frequency descending by default
      questions.sort((a, b) => b.frequency - a.frequency);

      // Assign sequential IDs
      questions.forEach((q, idx) => {
        q.id = idx + 1;
        q.topics.forEach((t) => allTopics.add(t));
      });

      companyData.timeWindows[key] = questions;

      if (key === 'all') {
        companyQuestionCount = questions.length;
      }
    }

    // Write per-company JSON
    const outputPath = path.join(OUTPUT_DIR, `${slug}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(companyData, null, 0));

    index.push({
      name: company,
      slug,
      questionCount: companyQuestionCount,
      topics: [...allTopics].sort(),
    });

    totalQuestions += companyQuestionCount;
  }

  // Sort index alphabetically
  index.sort((a, b) => a.name.localeCompare(b.name));

  // Write index
  const indexPath = path.join(OUTPUT_DIR, '_index.json');
  fs.writeFileSync(indexPath, JSON.stringify({ companies: index, totalQuestions }, null, 0));

  console.log(`✅ Done! Generated ${companies.length} company files + _index.json`);
  console.log(`   Total questions across all companies: ${totalQuestions}`);
}

main();
