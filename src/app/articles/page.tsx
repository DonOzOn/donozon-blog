/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArticleCard } from '@/components/ArticleCard';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { useSearchArticles, useArticles } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { usePopularTags } from '@/hooks/useTags';
import { Input, Select, Tag, Pagination, Skeleton, Button } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

export default function ArticlesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get('tags') ? searchParams.get('tags')!.split(',') : []
  );
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [pageSize] = useState(12); // Articles per page

  // Data fetching
  const { data: categories = [] } = useCategories();
  const { data: popularTags = [] } = usePopularTags(50);
  
  // Search or get all articles based on filters
  const hasFilters = searchQuery || selectedCategory || selectedTags.length > 0;
  
  const searchResults = useSearchArticles({
    query: searchQuery || undefined,
    category: selectedCategory || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    page: currentPage,
    limit: pageSize,
  });

  const allArticlesResults = useArticles({
    page: currentPage,
    limit: pageSize,
  });

  // Use search results if we have filters, otherwise use all articles
  const articlesQuery = hasFilters ? searchResults : allArticlesResults;
  const { data: articlesData, isLoading } = articlesQuery;
  
  const articles = articlesData?.data || [];
  const pagination = articlesData?.pagination || { total: 0, page: 1, limit: pageSize, hasNext: false };

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    if (currentPage > 1) params.set('page', currentPage.toString());

    const newUrl = params.toString() ? `/articles?${params.toString()}` : '/articles';
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, selectedCategory, selectedTags, currentPage, router]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Handle category filter
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setCurrentPage(1);
    }
  };

  // Handle tag removal
  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
    setCurrentPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTags([]);
    setCurrentPage(1);
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(pageSize)].map((_, index) => (
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

  const hasActiveFilters = searchQuery || selectedCategory || selectedTags.length > 0;

  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden">
      <Navbar />
      
      {/* Main Content */}
      <div className="bg-slate-900 py-8 lg:py-12">
        <div className="max-w-[1252px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Articles
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
              Explore our collection of tutorials, guides, and insights about web development, JavaScript, React, and more.
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              
              {/* Search Box */}
              <div className="flex-1">
                <Search
                  placeholder="Search articles by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSearch={handleSearch}
                  size="large"
                  style={{
                    backgroundColor: 'rgba(51, 65, 85, 0.3)',
                    borderColor: '#475569'
                  }}
                  styles={{
                    input: {
                      backgroundColor: 'transparent',
                      color: '#f8fafc'
                    }
                  }}
                />
              </div>

              {/* Category Filter */}
              <div className="w-full lg:w-48">
                <Select
                  placeholder="Select Category"
                  value={selectedCategory || undefined}
                  onChange={handleCategoryChange}
                  size="large"
                  style={{ width: '100%' }}
                  allowClear
                  dropdownStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {categories.map((category: { id: Key | null | undefined; slug: unknown; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                    <Option key={category.id} value={category.slug}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button
                  icon={<ClearOutlined />}
                  onClick={clearAllFilters}
                  size="large"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    color: '#f87171'
                  }}
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Popular Tags */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <FilterOutlined className="text-slate-400" />
                <span className="text-sm font-medium text-slate-300">Popular Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTags.slice(0, 15).map(tag => (
                  <Tag
                    key={tag.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedTags.includes(tag.name)
                        ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                        : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:border-slate-500'
                    }`}
                    onClick={() => 
                      selectedTags.includes(tag.name) 
                        ? handleTagRemove(tag.name)
                        : handleTagSelect(tag.name)
                    }
                  >
                    {tag.name} {tag.usage_count && `(${tag.usage_count})`}
                  </Tag>
                ))}
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-slate-300">Active Filters:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Tag
                      closable
                      onClose={() => setSearchQuery('')}
                      className="bg-emerald-500/20 border-emerald-400 text-emerald-300"
                    >
                      Search: &quot;{searchQuery}&quot;
                    </Tag>
                  )}
                  {selectedCategory && (
                    <Tag
                      closable
                      onClose={() => setSelectedCategory('')}
                      className="bg-purple-500/20 border-purple-400 text-purple-300"
                    >
                      Category: {categories.find((c: { slug: string; }) => c.slug === selectedCategory)?.name || selectedCategory}
                    </Tag>
                  )}
                  {selectedTags.map(tag => (
                    <Tag
                      key={tag}
                      closable
                      onClose={() => handleTagRemove(tag)}
                      className="bg-blue-500/20 border-blue-400 text-blue-300"
                    >
                      Tag: {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-slate-400">
              {isLoading ? (
                'Loading articles...'
              ) : (
                <>
                  Showing {articles.length > 0 ? ((currentPage - 1) * pageSize + 1) : 0} - {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} articles
                  {hasActiveFilters && ' (filtered)'}
                </>
              )}
            </div>
            
            {/* Articles count badge */}
            <div className="bg-slate-800/50 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-slate-300">
                {pagination.total} articles
              </span>
            </div>
          </div>

          {/* Articles Grid */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mb-4 rounded-full bg-slate-800 flex items-center justify-center mx-auto">
                <SearchOutlined className="text-3xl text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                {hasActiveFilters ? 'No articles found' : 'No articles yet'}
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-4">
                {hasActiveFilters 
                  ? 'Try adjusting your search criteria or removing some filters.'
                  : "We're working on adding great content. Check back soon!"
                }
              </p>
              {hasActiveFilters && (
                <Button 
                  type="primary" 
                  onClick={clearAllFilters}
                  style={{
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                    borderColor: 'transparent'
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {articles.map((article, index) => (
                  <ArticleCard
                    key={article.id}
                    title={article.title}
                    author={article.author_name || 'DonOzOn'}
                    date={article.published_at || article.created_at}
                    readTime={`${article.reading_time || 5} min read`}
                    imageUrl={article.featured_image_url || '/images/default-article.jpg'}
                    slug={article.slug}
                    isHovered={index % 8 === 3}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.total > pageSize && (
                <div className="flex justify-center">
                  <Pagination
                    current={currentPage}
                    total={pagination.total}
                    pageSize={pageSize}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) => 
                      `${range[0]}-${range[1]} of ${total} articles`
                    }
                    style={{
                      color: '#cbd5e1'
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />

      {/* Custom Styles */}
      <style jsx global>{`
        .ant-input {
          background-color: rgba(51, 65, 85, 0.3) !important;
          border-color: #475569 !important;
          color: #f8fafc !important;
        }

        .ant-input::placeholder {
          color: #94a3b8 !important;
        }

        .ant-input:focus,
        .ant-input-focused {
          border-color: #0ea5e9 !important;
          box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2) !important;
        }

        .ant-select-selector {
          background-color: rgba(51, 65, 85, 0.3) !important;
          border-color: #475569 !important;
          color: #f8fafc !important;
        }

        .ant-select-selection-placeholder {
          color: #94a3b8 !important;
        }

        .ant-select-arrow {
          color: #94a3b8 !important;
        }

        .ant-pagination .ant-pagination-item {
          background: rgba(51, 65, 85, 0.3) !important;
          border-color: #475569 !important;
        }

        .ant-pagination .ant-pagination-item a {
          color: #cbd5e1 !important;
        }

        .ant-pagination .ant-pagination-item-active {
          background: #0ea5e9 !important;
          border-color: #0ea5e9 !important;
        }

        .ant-pagination .ant-pagination-item-active a {
          color: #ffffff !important;
        }

        .ant-pagination .ant-pagination-prev,
        .ant-pagination .ant-pagination-next {
          color: #cbd5e1 !important;
        }

        .ant-pagination .ant-pagination-jump-prev,
        .ant-pagination .ant-pagination-jump-next {
          color: #cbd5e1 !important;
        }

        .ant-input-search .ant-input-group-addon {
          background: rgba(51, 65, 85, 0.3) !important;
          border-color: #475569 !important;
        }

        .ant-input-search .ant-btn {
          background: transparent !important;
          border-color: #475569 !important;
          color: #94a3b8 !important;
        }

        .ant-input-search .ant-btn:hover {
          color: #0ea5e9 !important;
          border-color: #0ea5e9 !important;
        }
      `}</style>
    </div>
  );
}
