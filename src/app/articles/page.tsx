'use client';

import { ArticleCard } from '@/components/ArticleCard';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Section } from '@/components/Section';
import { useArticles, useFeaturedArticles } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { Skeleton } from 'antd';

export default function ArticlesPage() {
  const { data: articlesData, isLoading: articlesLoading } = useArticles({ limit: 100 });
  const { data: featuredArticles = [], isLoading: featuredLoading } = useFeaturedArticles();
  const { data: categories = [] } = useCategories();

  const articles = articlesData?.data || [];
  const publishedArticles = articles.filter(article => article.status === 'published');
  const recentArticles = publishedArticles.slice(0, 8);
  const allPublishedArticles = publishedArticles;

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="space-y-4">
          <Skeleton.Image className="w-full h-48 rounded-lg" />
          <div className="space-y-2">
            <Skeleton.Input className="w-full h-6" />
            <Skeleton.Input className="w-3/4 h-4" />
            <div className="flex gap-4">
              <Skeleton.Input className="w-20 h-4" />
              <Skeleton.Input className="w-16 h-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden scroll-optimized">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 lg:py-32">
        {/* Background elements */}
        <div className="absolute inset-0 performance-optimized">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-emerald-500/8 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-red-500/8 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-[1252px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full glass-card border border-emerald-400/20 mb-8">
              <span className="text-sm font-medium text-emerald-300">📚 Knowledge Hub</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-[-0.02em] mb-6">
              <span className="block text-white">All</span>
              <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-red-400 bg-clip-text text-transparent">
                Articles
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Explore comprehensive tutorials, guides, and insights about web development, JavaScript, React, CSS and more.
            </p>

            {/* Stats */}
            <div className="flex justify-center items-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {articlesLoading ? '...' : allPublishedArticles.length}
                </div>
                <div className="text-sm text-slate-400">Published Articles</div>
              </div>
              <div className="w-px h-12 bg-slate-700"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{categories.length}</div>
                <div className="text-sm text-slate-400">Categories</div>
              </div>
              <div className="w-px h-12 bg-slate-700"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50k+</div>
                <div className="text-sm text-slate-400">Readers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Sections */}
      <div className="bg-slate-900 relative performance-optimized" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="space-y-20">
          {/* Featured Articles */}
          {!featuredLoading && featuredArticles.length > 0 && (
            <Section title="Featured Articles" linkText="See All Featured" linkHref="/articles?filter=featured">
              {featuredArticles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  title={article.title || ''}
                  author={article.author_name || 'DonOzOn'}
                  date={article.published_at|| ''}
                  readTime={`${article.reading_time || 5} min read`}
                  imageUrl={article.featured_image_url || '/images/default-article.jpg'}
                  slug={article.slug|| ''}
                  isHovered={index === 0}
                />
              ))}
            </Section>
          )}

          {/* Recent Articles */}
          {!articlesLoading && recentArticles.length > 0 && (
            <Section title="Recent Articles" linkText="Load More" linkHref="#loadmore">
              {recentArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  author={article.author_name || 'DonOzOn'}
                  date={article.published_at}
                  readTime={`${article.reading_time || 5} min read`}
                  imageUrl={article.featured_image_url || '/images/default-article.jpg'}
                  slug={article.slug}
                />
              ))}
            </Section>
          )}

          {/* All Articles Grid */}
          <section className="relative">
            {/* Background elements */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-2xl"></div>
            </div>

            <div className="max-w-[1252px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
                <div className="flex items-center space-x-6">
                  <h2 className="text-2xl sm:text-[32px] font-bold text-white leading-tight tracking-[-0.02em]">
                    Complete Archive
                  </h2>
                  <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500"></div>
                </div>
                
                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  {['All', 'CSS', 'JavaScript', 'React', 'Featured'].map((filter) => (
                    <button
                      key={filter}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        filter === 'All' 
                          ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white' 
                          : 'glass-card text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Articles Grid */}
              {articlesLoading ? (
                <LoadingSkeleton />
              ) : allPublishedArticles.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mb-4 rounded-full bg-slate-800 flex items-center justify-center mx-auto">
                    <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">No Published Articles Yet</h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    We're working on adding great content. Check back soon for amazing articles!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                  {allPublishedArticles.map((article, index) => (
                    <ArticleCard
                      key={article.id}
                      title={article.title}
                      author={article.author_name || 'DonOzOn'}
                      date={article.published_at}
                      readTime={`${article.reading_time || 5} min read`}
                      imageUrl={article.featured_image_url || '/images/default-article.jpg'}
                      slug={article.slug}
                      isHovered={index % 8 === 3} // Add some variety
                    />
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {!articlesLoading && allPublishedArticles.length > 0 && (
                <div className="flex justify-center mt-16">
                  <button className="group relative px-8 py-4 glass-card rounded-xl font-semibold text-white border border-white/20 hover:border-emerald-400/40 transition-all duration-300 hover:bg-emerald-500/10">
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Load More Articles
                    </span>
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}