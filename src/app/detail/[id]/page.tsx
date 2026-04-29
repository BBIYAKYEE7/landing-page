'use client';

import SitePage from './SitePage';
import MciLinkPage from './MciLinkPage';

interface PageProps {
  params: { id: string };
}

export default function DetailPage({ params }: PageProps) {
  const { id } = params;

  if (id === '2') {
    return <MciLinkPage />;
  }

  return <SitePage />;
}
