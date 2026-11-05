import BusinessSection from '@/components/BusinessSection';
import CompanySection from '@/components/CompanySection';
import ContactSection from '@/components/ContactSection';
import Hero from '@/components/Hero';
import HistorySection from '@/components/HistorySection';
import OutsourcingSection from '@/components/OutsourcingSection';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <Hero />
        <CompanySection />
        <BusinessSection />
        <OutsourcingSection />
        <HistorySection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
