/* eslint-disable @typescript-eslint/no-unused-vars */
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftOutlined, TagOutlined } from '@ant-design/icons';

import { ArticleCard } from '@/components/ArticleCard';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { getArticlesByCategory } from '@/lib/articles';
import { normalizeArticleData, type ArticleCardData } from '@/types/ArticleCard';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  const categoryMap: Record<string, string> = {
    'css': 'css',
    'javascript': 'javascript',
    'react': 'react',
    'react-js': 'react',
    'tailwind': 'tailwind',
    'nextjs': 'nextjs',
    'typescript': 'typescript',
    'photography': 'photography',
    'development': 'development',
    'travel': 'travel',
    'food': 'food',
  };

  const category = categoryMap[slug];
  if (!category) {
    notFound();
  }

  const articles = await getArticlesByCategory(category);
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ');

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'css': '🎨',
      'javascript': '⚡',
      'react': '⚛️',
      'tailwind': '💨',
      'nextjs': '🚀',
      'typescript': '🔷',
      'photography': '📸',
      'development': '💻',
      'travel': '✈️',
      'food': '🍽️',
    };
    return icons[category] || '📝';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'css': 'from-blue-500 to-purple-500',
      'javascript': 'from-yellow-500 to-orange-500',
      'react': 'from-cyan-500 to-blue-500',
      'tailwind': 'from-teal-500 to-cyan-500',
      'nextjs': 'from-gray-600 to-gray-800',
      'typescript': 'from-blue-600 to-blue-800',
      'photography': 'from-pink-500 to-rose-500',
      'development': 'from-green-500 to-emerald-500',
      'travel': 'from-indigo-500 to-purple-500',
      'food': 'from-orange-500 to-red-500',
    };
    return colors[slug] || 'from-emerald-500 to-cyan-500';
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden">
      <Navbar />
      
      {/* Category Hero Section */}
      <section className="relative bg-gradient-hero py-20 lg:py-32">
        {/* Background elements */}
        <div className="absolute inset-0 performance-optimized">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-emerald-500/8 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-cyan-500/8 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm">
              <Link 
                href="/" 
                className="text-slate-400 hover:text-emerald-400 transition-colors duration-200"
              >
                Home
              </Link>
              <span className="text-slate-600">/</span>
              <Link 
                href="/articles" 
                className="text-slate-400 hover:text-emerald-400 transition-colors duration-200"
              >
                Articles
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-slate-300">{categoryName}</span>
            </div>
          </nav>

          {/* Back Button */}
          <div className="mb-8">
            <Link 
              href="/articles"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors duration-200 group"
            >
              <ArrowLeftOutlined className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back to All Articles</span>
            </Link>
          </div>

          <div className="text-center">
            {/* Category Icon & Badge */}
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full glass-card border border-white/20 mb-4">
                <span className="text-2xl mr-3">{getCategoryIcon(slug)}</span>
                <TagOutlined className="mr-2 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">Category</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-[-0.02em] mb-6">
              <span className="block text-white mb-2">{categoryName}</span>
              <span className={`block bg-gradient-to-r ${getCategoryColor(slug)} bg-clip-text text-transparent`}>
                Articles
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-8">
              Explore our collection of {categoryName.toLowerCase()} tutorials, guides, and insights.
            </p>

            {/* Stats */}
            <div className="flex justify-center items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {articles.length}
                </div>
                <div className="text-sm text-slate-400">Articles</div>
              </div>
              <div className="w-px h-12 bg-slate-700"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {Math.ceil(articles.length / 4) || 1}
                </div>
                <div className="text-sm text-slate-400">Pages</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="relative bg-slate-900 py-20">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mb-6 rounded-full glass-card border border-white/10 flex items-center justify-center mx-auto">
                <span className="text-4xl">{getCategoryIcon(slug)}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Articles Found</h3>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                We haven&apos;t published any {categoryName.toLowerCase()} articles yet, but we&apos;re working on it!
              </p>
              <Link 
                href="/articles"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300"
              >
                <ArrowLeftOutlined />
                Browse All Articles
              </Link>
            </div>
          ) : (
            <>
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
                <div className="flex items-center space-x-6">
                  <h2 className="text-2xl sm:text-[32px] font-bold text-white leading-tight tracking-[-0.02em]">
                    Latest in {categoryName}
                  </h2>
                  <div className={`w-12 sm:w-20 h-0.5 bg-gradient-to-r ${getCategoryColor(slug)}`}></div>
                </div>
                
                <div className="text-slate-400">
                  <span className="text-sm">
                    {articles.length} article{articles.length !== 1 ? 's' : ''} found
                  </span>
                </div>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {articles.map((article, index) => {
                  const normalizedProps = normalizeArticleData({
                    ...article,
                    category: article.category || categoryName
                  } as ArticleCardData);
                  return (
                    <ArticleCard
                      key={article.id}
                      {...normalizedProps}
                      isHovered={index % 4 === 1} // Add some variety
                    />
                  );
                })}
              </div>

              {/* Load More Section */}
              {articles.length >= 12 && (
                <div className="flex justify-center mt-16">
                  <button className="group relative px-8 py-4 glass-card rounded-xl font-semibold text-white border border-white/20 hover:border-emerald-400/40 transition-all duration-300 hover:bg-emerald-500/10">
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Load More {categoryName} Articles
                    </span>
                  </button>
                </div>
              )}

              {/* Related Categories */}
              <div className="mt-20 pt-16 border-t border-slate-700">
                <h3 className="text-xl font-bold text-white mb-8 text-center">
                  Explore Other Categories
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {['css', 'javascript', 'react', 'typescript', 'nextjs'].filter(cat => cat !== slug).map((category) => (
                    <Link
                      key={category}
                      href={`/category/${category}`}
                      className="inline-flex items-center gap-2 px-4 py-2 glass-card border border-white/10 rounded-full text-slate-300 hover:text-white hover:border-emerald-400/40 transition-all duration-200"
                    >
                      <span>{getCategoryIcon(category)}</span>
                      <span className="text-sm font-medium">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Generate metadata for the category page
export async function generateMetadata({ params }: CategoryPageProps) {
  try {
    const { slug } = await params;
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ');

    return {
      title: `${categoryName} Articles | DonOzOn Blog`,
      description: `Explore our collection of ${categoryName.toLowerCase()} tutorials, guides, and insights. Learn with step-by-step instructions and practical examples.`,
      openGraph: {
        title: `${categoryName} Articles | DonOzOn Blog`,
        description: `Explore our collection of ${categoryName.toLowerCase()} tutorials and guides.`,
        type: 'website',
        siteName: 'DonOzOn Blog',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${categoryName} Articles | DonOzOn Blog`,
        description: `Explore our collection of ${categoryName.toLowerCase()} tutorials and guides.`,
        creator: '@donozon',
      },
      keywords: `${categoryName.toLowerCase()}, tutorials, guides, web development, programming, ${slug}`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Category | DonOzOn Blog',
      description: 'Explore articles by category on DonOzOn Blog.',
    };
  }
}
