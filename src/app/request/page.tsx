import RequestForm from '@/components/request/RequestForm';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { meta } from '@/content/site';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({ title: meta.requestTitle, description: meta.requestDescription, path: '/request' });

export default function RequestPage() {
  return (
    <>
      <SiteHeader showCta={false} />
      <main id="main" tabIndex={-1}>
        <div className="container">
          <RequestForm />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
