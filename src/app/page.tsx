import Link from 'next/link';
import { Button } from 'antd';

import { BrowseCategory } from '@/components/BrowseCategory';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { Navbar } from '@/components/Navbar';
import { ArticleSection } from '@/components/ArticleSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden scroll-optimized">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Browse Category Section */}
      <BrowseCategory />
      
      {/* Article Sections Container */}
      <div className="bg-slate-900 relative performance-optimized z-5" style={{ marginTop: '0px', paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="space-y-20">
          {/* Featured Articles Section */}
          <ArticleSection
            title="Featured Article"
            linkHref="/articles"
            featured={true}
            limit={4}
          />

          {/* Photography Section */}
          <ArticleSection
            title="Photography"
            categorySlug="photography"
            linkHref="/category/photography"
            limit={4}
          />

          {/* Development Section */}
          <ArticleSection
            title="Development"
            categorySlug="development"
            linkHref="/category/development"
            limit={4}
          />

          {/* Travel Section */}
          <ArticleSection
            title="Travel"
            categorySlug="travel"
            linkHref="/category/travel"
            limit={4}
          />

          {/* Food Section */}
          <ArticleSection
            title="Food"
            categorySlug="food"
            linkHref="/category/food"
            limit={4}
          />

          {/* More Article Button */}
          <div className="flex justify-center py-16">
            <Link href="/articles">
              <Button
                type="primary"
                size="large"
                className="h-12 px-12 bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 rounded-lg font-semibold text-base"
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  height: '48px'
                }}
              >
                More Article
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}