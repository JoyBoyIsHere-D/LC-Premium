const fs = require('fs');
const path = require('path');
const simpleIcons = require('simple-icons');

const DATA_DIR = path.resolve(__dirname, '../public/data');
const OUT_FILE = path.resolve(__dirname, '../src/lib/company-icons.json');

// Read all companies from the index
const indexPath = path.join(DATA_DIR, '_index.json');
let indexData;
try {
  indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
} catch (e) {
  console.error("Index not found, please build data first.");
  process.exit(1);
}

// Convert simple-icons to a more searchable array
const allIcons = Object.values(simpleIcons);

// Manual mappings for tricky names
const CUSTOM_MAPPINGS = {
  'amazon': 'amazon',
  'apple': 'apple',
  'meta': 'meta',
  'google': 'google',
  'uber': 'uber',
  'j-p--morgan': 'jpmorgan', // J.P. Morgan
  'goldman-sachs': 'goldmansachs',
  'microsoft': 'microsoft',
  'netflix': 'netflix',
  'bloomberg': 'bloomberg',
  'linkedin': 'linkedin',
  'atlassian': 'atlassian',
  'salesforce': 'salesforce',
  'tiktok': 'tiktok',
  'bytedance': 'bytedance',
  'nvidia': 'nvidia',
  'visa': 'visa',
  'paypal': 'paypal',
  'adobe': 'adobe',
  'oracle': 'oracle',
  'snap': 'snapchat', // Snap -> Snapchat
  'twosigma': 'twosigma', // Wait, does simple-icons have it?
  'twitter': 'x',
  'x': 'x',
  // generic mappings can just rely on heuristic
};

const result = {};
let foundCount = 0;

for (const company of indexData.companies) {
  const name = company.name;
  const slug = company.slug; // e.g. "j-p--morgan"
  
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Try to find icon
  let matchedIcon = null;
  
  // 1. Try custom mapping
  if (CUSTOM_MAPPINGS[slug]) {
    matchedIcon = allIcons.find(i => i.slug === CUSTOM_MAPPINGS[slug]);
  }
  
  // 2. Try exact slug match
  if (!matchedIcon) {
    matchedIcon = allIcons.find(i => i.slug === cleanName);
  }
  
  // 3. Try name match
  if (!matchedIcon) {
    matchedIcon = allIcons.find(i => i.title.toLowerCase() === name.toLowerCase());
  }

  // 4. Try matching with removed spaces
  if (!matchedIcon) {
    matchedIcon = allIcons.find(i => i.title.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanName);
  }

  if (matchedIcon) {
    result[slug] = {
      path: matchedIcon.path,
      hex: matchedIcon.hex
    };
    foundCount++;
  }
}

fs.writeFileSync(OUT_FILE, JSON.stringify(result, null, 2));
console.log(`Matched ${foundCount} out of ${indexData.length} companies to Simple Icons.`);
