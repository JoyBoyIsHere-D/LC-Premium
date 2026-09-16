import fs from 'fs';
import path from 'path';
import type { CompanyData, IndexData } from './types';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');

export function getCompanyIndex(): IndexData {
  const filePath = path.join(DATA_DIR, '_index.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as IndexData;
}

export function getCompanyData(slug: string): CompanyData | null {
  try {
    const filePath = path.join(DATA_DIR, `${slug}.json`);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as CompanyData;
  } catch {
    return null;
  }
}

export function getAllCompanySlugs(): string[] {
  const index = getCompanyIndex();
  return index.companies.map((c) => c.slug);
}
