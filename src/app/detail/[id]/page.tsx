'use client';

import SitePage from './SitePage';
import BeepBeepPage from './BeepBeepPage';

interface PageProps {
  params: { id: string };
}

export default function DetailPage({ params }: PageProps) {
  const { id } = params;

  if (id === '2') {
    return <BeepBeepPage />;
  }

  return <SitePage />;
}
