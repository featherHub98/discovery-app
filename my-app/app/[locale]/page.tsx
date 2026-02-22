import LandingPage from '../components/LandingPage/LandinPage'; 
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';


export async function generateMetadata({ 
  params 
}: { 
  params:Promise< { locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  

  const t = await getTranslations({ locale, namespace: 'Home' });

  return {
    title: t('metaTitle'), 
    description: t('metaDescription'),
    keywords: t.raw('metaKeywords'), 
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'website',
    },
  };
}

export default function Home() {
  return <LandingPage />;
}