import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { TrustedClientsSection } from '@/components/home/TrustedClientsSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CategoriesSection />
      <FeaturesSection />
      <TrustedClientsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
