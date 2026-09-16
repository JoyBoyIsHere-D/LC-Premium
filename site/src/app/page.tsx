import CompanyGrid from '@/components/CompanyGrid';
import { getCompanyIndex } from '@/lib/data';

export default function HomePage() {
  const { companies, totalQuestions } = getCompanyIndex();

  return (
    <CompanyGrid companies={companies} totalQuestions={totalQuestions} />
  );
}
