'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { ArrowLeftOutlined, TagOutlined, SearchOutlined, FilterOutlined, CloseOutlined } from '@ant-design/icons';

import { ArticleCard } from '@/components/ArticleCard';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { normalizeArticleData, type ArticleCardData } from '@/types/ArticleCard';

interface CategoryPageClientProps {
  slug: string;
  initialArticles: ArticleCardData[];
}

export function CategoryPageClient({ slug, initialArticles }: CategoryPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ');

  // Get all unique tags from articles
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    initialArticles.forEach(article => {
      if (article.tags && Array.isArray(article.tags)) {
        article.tags.forEach((tag: string) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [initialArticles]);

  // Filter and sort articles based on search query, selected tags, and sort option
  const filteredArticles = useMemo(() => {
    const filtered = initialArticles.filter(article => {
      // Filter by search query (title)
      const matchesSearch = searchQuery === '' || 
        article.title?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by selected tags
      const matchesTags = selectedTags.length === 0 || 
        (article.tags && Array.isArray(article.tags) && 
         selectedTags.every(tag => article.tags!.includes(tag)));

      return matchesSearch && matchesTags;
    });

    // Sort articles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || b.date || 0).getTime() - new Date(a.created_at || a.date || 0).getTime();
        case 'oldest':
          return new Date(a.created_at || a.date || 0).getTime() - new Date(b.created_at || b.date || 0).getTime();
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [initialArticles, searchQuery, selectedTags, sortBy]);

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

  const getCategoryColor = (categorySlug: string) => {
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
    return colors[categorySlug] || 'from-emerald-500 to-cyan-500';
  };

  const getCategoryBgGradient = (categorySlug: string) => {
    const gradients: Record<string, string> = {
      'css': 'bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900',
      'javascript': 'bg-gradient-to-br from-slate-900 via-yellow-900/20 to-slate-900',
      'react': 'bg-gradient-to-br from-slate-900 via-cyan-900/20 to-slate-900',
      'tailwind': 'bg-gradient-to-br from-slate-900 via-teal-900/20 to-slate-900',
      'nextjs': 'bg-gradient-to-br from-slate-900 via-gray-800/30 to-slate-900',
      'typescript': 'bg-gradient-to-br from-slate-900 via-blue-900/25 to-slate-900',
      'photography': 'bg-gradient-to-br from-slate-900 via-pink-900/20 to-slate-900',
      'development': 'bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900',
      'travel': 'bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900',
      'food': 'bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900',
    };
    return gradients[categorySlug] || 'bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900';
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden">
      <Navbar />
      
      {/* Category Hero Section - Aligned with Header/Footer */}
      <section className={`relative ${getCategoryBgGradient(slug)} py-20`}>
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-1/4 left-1/4 w-48 h-48 bg-gradient-to-r ${getCategoryColor(slug)}/10 rounded-full blur-2xl`}></div>
          <div className={`absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r ${getCategoryColor(slug)}/8 rounded-full blur-2xl`}></div>
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r ${getCategoryColor(slug)}/5 rounded-full blur-3xl`}></div>
        </div>

        <div className="relative max-w-[1252px] mx-auto px-4 sm:px-6 lg:px-8">
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
                href="/categories" 
                className="text-slate-400 hover:text-emerald-400 transition-colors duration-200"
              >
                Categories
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-slate-300">{categoryName}</span>
            </div>
          </nav>

          {/* Back Button */}
          <div className="mb-8">
            <Link 
              href="/categories"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors duration-200 group"
            >
              <ArrowLeftOutlined className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back to Categories</span>
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
                  {initialArticles.length}
                </div>
                <div className="text-sm text-slate-400">Total Articles</div>
              </div>
              <div className="w-px h-12 bg-slate-700"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {filteredArticles.length}
                </div>
                <div className="text-sm text-slate-400">Filtered Results</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section - Aligned with Header/Footer */}
      <section className="relative bg-slate-900 py-8 border-b border-slate-700">
        <div className="relative max-w-[1252px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <SearchOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <CloseOutlined />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
                className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  showFilters || selectedTags.length > 0
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600'
                }`}
              >
                <FilterOutlined />
                <span>Filters</span>
                {selectedTags.length > 0 && (
                  <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                    {selectedTags.length}
                  </span>
                )}
              </button>

              {/* Clear Filters */}
              {(searchQuery || selectedTags.length > 0 || sortBy !== 'newest') && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-3 text-slate-400 hover:text-white transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Tags Filter Panel */}
          {showFilters && allTags.length > 0 && (
            <div className="mt-6 p-6 glass-card rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Filter by Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(searchQuery || selectedTags.length > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-400">Active filters:</span>
              
              {searchQuery && (
                <div className="flex items-center gap-1 px-3 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-lg border border-slate-600/50">
                  <SearchOutlined className="text-xs" />
                  <span>&ldquo;{searchQuery}&rdquo;</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 text-slate-400 hover:text-white"
                  >
                    <CloseOutlined className="text-xs" />
                  </button>
                </div>
              )}

              {selectedTags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-emerald-600/20 text-emerald-300 text-sm rounded-lg border border-emerald-500/30"
                >
                  <span>#{tag}</span>
                  <button
                    onClick={() => toggleTag(tag)}
                    className="ml-1 text-emerald-400 hover:text-emerald-200"
                  >
                    <CloseOutlined className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Articles Section - Aligned with Header/Footer */}
      <section className="relative bg-slate-900 py-20">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-[1252px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mb-6 rounded-full glass-card border border-white/10 flex items-center justify-center mx-auto">
                <span className="text-4xl">{getCategoryIcon(slug)}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {initialArticles.length === 0 ? 'No Articles Found' : 'No Matching Articles'}
              </h3>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                {initialArticles.length === 0 
                  ? `We haven't published any ${categoryName.toLowerCase()} articles yet, but we're working on it!`
                  : 'Try adjusting your search or filter criteria to find more articles.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {(searchQuery || selectedTags.length > 0) && (
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                )}
                <Link 
                  href="/categories"
                  className="inline-flex items-center gap-2 px-6 py-3 glass-card border border-white/20 text-white font-semibold rounded-xl hover:border-emerald-400/40 transition-all duration-300"
                >
                  <ArrowLeftOutlined />
                  Browse Categories
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
                <div className="flex items-center space-x-6">
                  <h2 className="text-2xl sm:text-[32px] font-bold text-white leading-tight tracking-[-0.02em]">
                    {searchQuery || selectedTags.length > 0 ? 'Filtered Results' : `Latest in ${categoryName}`}
                  </h2>
                  <div className={`w-12 sm:w-20 h-0.5 bg-gradient-to-r ${getCategoryColor(slug)}`}></div>
                </div>
                
                <div className="text-slate-400">
                  <span className="text-sm">
                    {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                  </span>
                </div>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {filteredArticles.map((article, index) => {
                  const normalizedProps = normalizeArticleData({
                    ...article,
                    category: article.category || categoryName
                  } as ArticleCardData);
                  return (
                    <ArticleCard
                      key={article.id}
                      {...normalizedProps}
                      isHovered={index % 4 === 1}
                    />
                  );
                })}
              </div>

              {/* Related Categories */}
              <div className="mt-20 pt-16 border-t border-slate-700">
                <h3 className="text-xl font-bold text-white mb-8 text-center">
                  Explore Other Categories
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {['css', 'javascript', 'react', 'typescript', 'nextjs', 'photography', 'development'].filter(cat => cat !== slug).slice(0, 6).map((category) => (
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