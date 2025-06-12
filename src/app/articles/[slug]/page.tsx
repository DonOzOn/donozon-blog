import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftOutlined, ClockCircleOutlined, EyeOutlined, TagOutlined, ShareAltOutlined, FacebookOutlined, TwitterOutlined, LinkedinOutlined } from '@ant-design/icons';

import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { getArticleBySlug } from '@/lib/articles';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  
  try {
    const article = await getArticleBySlug(slug);

    if (!article) {
      notFound();
    }

    // Safe property access with fallbacks
    const safeArticle = {
      id: article.id || '',
      title: article.title || 'Untitled Article',
      slug: article.slug || slug,
      excerpt: article.excerpt || 'No excerpt available.',
      content: article.content || 'No content available.',
      author: article.author || 'DonOzOn',
      publishedAt: article.publishedAt || new Date().toISOString(),
      readTime: article.readTime || '5 min read',
      imageUrl: article.imageUrl || '/images/default-article.jpg',
      category: article.category || 'uncategorized',
      tags: article.tags || [],
      featured: article.featured || false,
    };

    const formatDate = (dateString: string) => {
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return 'Recent';
      }
    };

    const getCategoryDisplay = (category: string) => {
      if (!category || category.length === 0) return 'General';
      return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
    };

    const getAuthorInitials = (author: string) => {
      if (!author || author.length === 0) return 'A';
      return author.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);
    };

    return (
      <div className="min-h-screen bg-slate-900 overflow-x-hidden">
        <Navbar />
        
        {/* Article Hero Section - Medium Style Layout */}
        <section className="relative bg-gradient-hero py-12 lg:py-20">
          {/* Background elements */}
          <div className="absolute inset-0 performance-optimized">
            <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-emerald-500/8 rounded-full blur-2xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-cyan-500/8 rounded-full blur-2xl"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <span className="text-slate-300 truncate max-w-xs sm:max-w-none">
                  {safeArticle.title}
                </span>
              </div>
            </nav>

            {/* Back Button */}
            <div className="mb-8">
              <Link 
                href="/articles"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors duration-200 group"
              >
                <ArrowLeftOutlined className="group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Back to Articles</span>
              </Link>
            </div>

            {/* Article Header - Centered Medium Style */}
            <header className="text-center">
              {/* Category Badge */}
              <div className="mb-6">
                <Link 
                  href={`/category/${safeArticle.category}`}
                  className="inline-flex items-center px-4 py-2 rounded-full glass-card border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-200"
                >
                  <TagOutlined className="mr-2 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-300">
                    {getCategoryDisplay(safeArticle.category)}
                  </span>
                </Link>
              </div>
              
              {/* Featured Badge */}
              {safeArticle.featured && (
                <div className="mb-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30">
                    <span className="text-sm font-medium text-yellow-300">✨ Featured</span>
                  </div>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-[-0.02em] text-white mb-6">
                {safeArticle.title}
              </h1>
              
              {/* Excerpt */}
              <p className="text-lg sm:text-xl text-white leading-relaxed max-w-3xl mx-auto mb-8">
                {safeArticle.excerpt}
              </p>

              {/* Article Meta */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-slate-400">
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {getAuthorInitials(safeArticle.author)}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="text-slate-300 font-medium">{safeArticle.author}</div>
                    <div className="text-sm text-slate-400">Author</div>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-12 bg-slate-700"></div>

                {/* Date & Read Time */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <ClockCircleOutlined className="text-slate-500" />
                    <span className="text-sm">{formatDate(safeArticle.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <EyeOutlined className="text-slate-500" />
                    <span className="text-sm">{safeArticle.readTime}</span>
                  </div>
                </div>
              </div>
            </header>
          </div>
        </section>

        {/* Article Content */}
        <article className="relative bg-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            {/* Featured Image - Medium Style (Full Width Below Header) */}
            {safeArticle.imageUrl && safeArticle.imageUrl !== '/images/default-article.jpg' && (
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 glass-card border border-white/10">
                <Image
                  src={safeArticle.imageUrl}
                  alt={safeArticle.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Article Body */}
            <div className="max-w-none">
              <div 
                className="article-content text-white"
                style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                }}
              >
                {safeArticle.content ? (
                  <div 
                    className="prose prose-lg prose-invert max-w-none [&>*]:text-white [&>p]:text-white [&>div]:text-white [&>span]:text-white"
                    dangerouslySetInnerHTML={{ 
                      __html: safeArticle.content
                        .replace(/\n/g, '<br />')
                        .replace(/#{1,6}\s*(.*)/g, '<h2 class="text-2xl font-bold text-white mt-8 mb-4">$1</h2>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em class="text-slate-200">$1</em>')
                    }} 
                  />
                ) : (
                  <div className="space-y-6 text-white">
                    <p className="text-white">
                      This is a sample article content. In a real implementation, you would render the full article content here. 
                      The content could come from markdown, a rich text editor, or any other content management system.
                    </p>
                    
                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Introduction</h2>
                    <p className="text-white">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et 
                      dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip 
                      ex ea commodo consequat.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Getting Started</h2>
                    <p className="text-white">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>

                    <div className="glass-card border border-emerald-400/20 bg-emerald-500/5 p-6 my-6 rounded-xl">
                      <p className="text-emerald-200 font-medium mb-2 flex items-center gap-2">
                        <span className="text-emerald-400">💡</span>
                        <strong>Pro Tip:</strong>
                      </p>
                      <p className="text-white">
                        This is where you would add helpful tips and insights related to the article topic.
                      </p>
                    </div>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Key Points</h2>
                    <ul className="space-y-2 text-white list-disc list-inside">
                      <li>First important concept that readers need to understand</li>
                      <li>Second key point that builds on the previous information</li>
                      <li>Third essential element for complete understanding</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Conclusion</h2>
                    <p className="text-white">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                      totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Article Tags */}
            {safeArticle.tags && safeArticle.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TagOutlined className="text-emerald-400" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {safeArticle.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="px-3 py-1 text-sm font-medium text-white bg-slate-800/50 border border-slate-600 hover:border-emerald-400/40 hover:text-emerald-300 transition-all duration-200 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-slate-700">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <ShareAltOutlined className="text-emerald-400" />
                    Share this article
                  </h3>
                  <p className="text-slate-400">Help others discover this content</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-slate-800/50 border border-slate-600 text-white hover:border-blue-400/40 hover:text-blue-300 rounded-lg transition-all duration-200 flex items-center gap-2">
                    <FacebookOutlined />
                    Facebook
                  </button>
                  <button className="px-4 py-2 bg-slate-800/50 border border-slate-600 text-white hover:border-cyan-400/40 hover:text-cyan-300 rounded-lg transition-all duration-200 flex items-center gap-2">
                    <TwitterOutlined />
                    Twitter
                  </button>
                  <button className="px-4 py-2 bg-slate-800/50 border border-slate-600 text-white hover:border-blue-500/40 hover:text-blue-300 rounded-lg transition-all duration-200 flex items-center gap-2">
                    <LinkedinOutlined />
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-16 pt-8 border-t border-slate-700">
              <div className="flex justify-center">
                <Link href="/articles">
                  <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 border-none hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 rounded-xl text-white font-semibold flex items-center gap-2">
                    <ArrowLeftOutlined />
                    Back to All Articles
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </article>

        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error loading article:', error);
    notFound();
  }
}

// Generate metadata for the article
export async function generateMetadata({ params }: ArticlePageProps) {
  try {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
      return {
        title: 'Article Not Found | DonOzOn Blog',
        description: 'The requested article could not be found.',
      };
    }

    return {
      title: `${article.title} | DonOzOn Blog`,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        images: article.imageUrl ? [article.imageUrl] : [],
        type: 'article',
        publishedTime: article.publishedAt,
        authors: [article.author],
        siteName: 'DonOzOn Blog',
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt,
        images: article.imageUrl ? [article.imageUrl] : [],
        creator: '@donozon',
      },
      keywords: article.tags?.join(', '),
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Article | DonOzOn Blog',
      description: 'Read the latest articles on web development, programming, and technology.',
    };
  }
}