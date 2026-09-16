import { notFound } from 'next/navigation';
import CompanyView from '@/components/CompanyView';
import { getCompanyData, getAllCompanySlugs } from '@/lib/data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllCompanySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const data = getCompanyData(slug);
  if (!data) return { title: 'Not Found' };

  const total = data.timeWindows.all?.length || 0;
  return {
    title: `${data.name} — ${total} LeetCode Problems | LC Premium`,
    description: `Explore ${total} LeetCode interview questions asked by ${data.name}, sorted by frequency. Filter by difficulty, topic, and time window.`,
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;
  const data = getCompanyData(slug);

  if (!data) {
    notFound();
  }

  return <CompanyView data={data} />;
}
