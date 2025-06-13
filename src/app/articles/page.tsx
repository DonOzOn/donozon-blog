/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArticleCard } from '@/components/ArticleCard';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { SearchSuggestions } from '@/components/SearchSuggestions';
import { normalizeArticleData, type ArticleCardData } from '@/types/ArticleCard';
import { useSearchArticles, useArticles } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { usePopularTags } from '@/hooks/useTags';
import { useDebouncedSearch } from '@/hooks/useDebounce';
import { useSearchPerformance } from '@/hooks/useSearchPerformance';
import { Input, Select, Tag, Pagination, Button, Spin } from 'antd';
import { SearchOutlined, ClearOutlined, LoadingOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;


export default function ArticlesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <Spin size="large" />
        </div>
      }
    >
      <ArticlesPageContent />
    </Suspense>
  );
}

 function ArticlesPageContent() {
  'use client';
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Add mounted state to prevent hydration issues
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Debounced search hook
  const {
    searchValue,
    debouncedValue: debouncedSearchQuery,
    setSearchValue: setSearchQuery,
    isSearching,
    hasValue: hasSearchValue,
    hasActiveSearch,
    searchHistory,
    clearSearch,
    clearHistory
  } = useDebouncedSearch(searchParams.get('search') || '', 300);
  
  // Search suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchInputFocused, setSearchInputFocused] = useState(false);
  
  // Search performance tracking
  const { startSearch, endSearch } = useSearchPerformance();
  
  // State for filters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get('tags') ? searchParams.get('tags')!.split(',') : []
  );
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [pageSize] = useState(12); // Articles per page

  // Data fetching
  const { data: categories = [] } = useCategories();
  const { data: popularTags = [] } = usePopularTags(50);
  
  // Determine if we have active filters
  const hasFilters = debouncedSearchQuery || selectedCategory || selectedTags.length > 0;
  
  // Always fetch all articles as fallback
  const allArticlesResults = useArticles({
    page: currentPage,
    limit: pageSize,
  });

  // Fetch search results only when we have filters
  const searchResults = useSearchArticles({
    query: debouncedSearchQuery || undefined,
    category: selectedCategory || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    page: currentPage,
    limit: pageSize,
  });

  // Use search results if we have filters AND search results are available, otherwise use all articles
  const shouldUseSearchResults = hasFilters && searchResults.data;
  const articlesQuery = shouldUseSearchResults ? searchResults : allArticlesResults;
  const { data: articlesData, isLoading } = articlesQuery;
  
  // Use search loading state only when actively searching with filters
  const isActuallyLoading = hasFilters ? searchResults.isLoading : allArticlesResults.isLoading;
  
  const articles = articlesData?.data || [];
  const pagination = articlesData?.pagination || { total: 0, page: 1, limit: pageSize, hasNext: false };

  // Track search performance
  useEffect(() => {
    if (debouncedSearchQuery && !isLoading) {
      endSearch(debouncedSearchQuery, pagination.total);
    }
  }, [debouncedSearchQuery, isLoading, pagination.total, endSearch]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      startSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, startSearch]);

  // Update URL when filters change (only for debounced search value)
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set('search', debouncedSearchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    if (currentPage > 1) params.set('page', currentPage.toString());

    const newUrl = params.toString() ? `/articles?${params.toString()}` : '/articles';
    router.replace(newUrl, { scroll: false });
  }, [debouncedSearchQuery, selectedCategory, selectedTags, currentPage, router]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    setShowSuggestions(true);
  };

  // Handle search submit (immediate search)
  const handleSearchSubmit = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setShowSuggestions(false);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    setCurrentPage(1);
    setShowSuggestions(false);
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    setSearchInputFocused(true);
    if (searchHistory.length > 0 || !hasActiveSearch) {
      setShowSuggestions(true);
    }
  };

  // Handle search input blur
  const handleSearchBlur = () => {
    setSearchInputFocused(false);
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 150);
  };

  // Handle category filter
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  // Handle tags multi-select change
  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    clearSearch();
    setSelectedCategory('');
    setSelectedTags([]);
    setCurrentPage(1);
  };

  // Loading skeleton with improved animation
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(Math.min(pageSize, 8))].map((_, index) => (
        <div key={index} className="space-y-4 animate-pulse">
          <div className="w-full h-48 bg-slate-700/50 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-6 bg-slate-700/50 rounded w-full"></div>
            <div className="h-4 bg-slate-700/30 rounded w-3/4"></div>
            <div className="flex gap-4">
              <div className="h-4 bg-slate-700/30 rounded w-20"></div>
              <div className="h-4 bg-slate-700/30 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
      {isSearching && hasActiveSearch && (
        <div className="col-span-full text-center py-4">
          <div className="inline-flex items-center gap-2 text-slate-400">
            <LoadingOutlined className="text-blue-400" />
            <span>Searching for &quot;{searchValue}&quot;...</span>
          </div>
        </div>
      )}
    </div>
  );

  const hasActiveFilters = debouncedSearchQuery || selectedCategory || selectedTags.length > 0;

  // Don't render until mounted to prevent hydration mismatches
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Suspense>
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
              <div className="flex-1 relative">
                <div className="search-wrapper" style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.9)',
                  borderRadius: '8px',
                  padding: '0'
                }}>
                <Search
                  placeholder="Search articles by title, content, or tags..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  onSearch={handleSearchSubmit}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  size="large"
                  allowClear
                  className="dark-search-input"
                  style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    borderColor: searchInputFocused || hasActiveSearch ? '#0ea5e9' : '#475569',
                    borderRadius: '8px'
                  }}
                  styles={{
                    input: {
                      backgroundColor: 'rgba(30, 41, 59, 0.8) !important',
                      color: '#f8fafc !important',
                      fontSize: '16px'
                    },
                    suffix: {
                      backgroundColor: 'transparent'
                    }
                  }}
                  suffix={
                    isSearching && searchValue ? (
                      <div className="flex items-center gap-1">
                        <Spin 
                          indicator={<LoadingOutlined style={{ fontSize: 14, color: '#94a3b8' }} spin />} 
                          size="small"
                        />
                        <span className="text-xs text-slate-400">Searching...</span>
                      </div>
                    ) : hasActiveSearch ? (
                      <div className="text-xs text-blue-400">
                        {searchValue.length} chars
                      </div>
                    ) : undefined
                  }
                />
                
                {/* Search Suggestions */}
                <SearchSuggestions
                  searchHistory={searchHistory}
                  popularSearches={['React', 'JavaScript', 'TypeScript', 'Next.js', 'Web Development', 'Tutorial', 'Guide', 'Tips']}
                  onSelectSuggestion={handleSuggestionSelect}
                  onClearHistory={clearHistory}
                  isVisible={showSuggestions && (searchInputFocused || !hasActiveSearch)}
                />
                
                {/* Search status indicator */}
                {searchValue && searchValue !== debouncedSearchQuery && (
                  <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-xs text-slate-400">
                    <LoadingOutlined className="animate-spin" style={{ fontSize: 10 }} />
                    <span>Debouncing search query...</span>
                  </div>
                )}
                {/* Search feedback */}
                {debouncedSearchQuery && !isLoading && !isSearching && (
                  <div className="absolute -bottom-6 left-0 text-xs text-emerald-400">
                    ✓ Search updated • {pagination.total} results
                  </div>
                )}
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full lg:w-48">
                <Select
                  placeholder="Select Category"
                  value={selectedCategory || undefined}
                  onChange={handleCategoryChange}
                  size="large"
                  className="dark-select"
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

              {/* Tags Multi-Select */}
              <div className="w-full lg:w-64">
                <Select
                  mode="multiple"
                  placeholder="Select Tags"
                  value={selectedTags}
                  onChange={handleTagsChange}
                  size="large"
                  className="dark-select-tags"
                  style={{ width: '100%' }}
                  allowClear
                  maxTagCount="responsive"
                  dropdownStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  tagRender={(props) => {
                    const { label, closable, onClose } = props;
                    return (
                      <Tag
                        closable={closable}
                        onClose={onClose}
                        className="bg-blue-500/20 border-blue-400 text-blue-300 mr-1 mb-1"
                      >
                        {label}
                      </Tag>
                    );
                  }}
                  filterOption={(input, option: any) =>
                    option?.children?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {popularTags.map(tag => (
                    <Option key={tag.id} value={tag.name}>
                      <div className="flex justify-between items-center">
                        <span>{tag.name}</span>
                        {tag.usage_count && (
                          <span className="text-xs text-slate-400 ml-2">({tag.usage_count})</span>
                        )}
                      </div>
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
                  className="clear-filters-btn"
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

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-slate-300">Active Filters:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {debouncedSearchQuery && (
                    <Tag
                      closable
                      onClose={() => setSearchQuery('')}
                      className="bg-emerald-500/20 border-emerald-400 text-emerald-300"
                    >
                      Search: &quot;{debouncedSearchQuery}&quot;
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
                      onClose={() => handleTagsChange(selectedTags.filter(t => t !== tag))}
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
            <div className="text-slate-400 flex items-center gap-2">
              {isActuallyLoading || (isSearching && hasSearchValue && hasFilters) ? (
                <>
                  <Spin size="small" />
                  <span>
                    {isSearching && hasSearchValue && hasFilters ? 'Searching articles...' : 'Loading articles...'}
                  </span>
                </>
              ) : (
                <>
                  Showing {articles.length > 0 ? ((currentPage - 1) * pageSize + 1) : 0} - {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} articles
                  {hasActiveFilters && (
                    <span className="text-blue-400 font-medium">(filtered)</span>
                  )}
                  {debouncedSearchQuery && (
                    <span className="text-emerald-400 text-sm">
                      • Search: "{debouncedSearchQuery}"
                    </span>
                  )}
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
          {isActuallyLoading || (isSearching && hasSearchValue && hasFilters) ? (
            <LoadingSkeleton />
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mb-4 rounded-full bg-slate-800 flex items-center justify-center mx-auto">
                <SearchOutlined className="text-3xl text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                {hasActiveFilters ? (
                  debouncedSearchQuery ? 
                    `No articles found for "${debouncedSearchQuery}"` : 
                    'No articles match your filters'
                ) : 'No articles yet'}
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-4">
                {hasActiveFilters 
                  ? (debouncedSearchQuery ? 
                      'Try different keywords, check spelling, or browse by category.' :
                      'Try adjusting your filters or removing some categories/tags.'
                    )
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
                {articles.map((article, index) => {
                  const normalizedProps = normalizeArticleData(article as ArticleCardData);
                  return (
                    <ArticleCard
                      key={article.id}
                      {...normalizedProps}
                      isHovered={index % 8 === 3}
                    />
                  );
                })}
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
        /* Dark Search Input - Force dark background */
        .dark-search-input,
        .dark-search-input .ant-input-search,
        .dark-search-input .ant-input-search-large,
        .dark-search-input .ant-input {
          background-color: rgba(30, 41, 59, 0.9) !important;
          border-color: #475569 !important;
          color: #f8fafc !important;
          font-size: 16px !important;
        }

        .dark-search-input .ant-input::placeholder {
          color: #94a3b8 !important;
        }

        .dark-search-input .ant-input:focus,
        .dark-search-input .ant-input-focused,
        .dark-search-input:focus,
        .dark-search-input:focus-within {
          border-color: #0ea5e9 !important;
          box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2) !important;
          background-color: rgba(30, 41, 59, 0.95) !important;
        }

        .dark-search-input .ant-input-search .ant-input-group-addon {
          background: rgba(30, 41, 59, 0.9) !important;
          border-color: #475569 !important;
        }

        .dark-search-input .ant-input-search .ant-btn {
          background: rgba(30, 41, 59, 0.9) !important;
          border-color: #475569 !important;
          color: #94a3b8 !important;
        }

        .dark-search-input .ant-input-search .ant-btn:hover {
          color: #0ea5e9 !important;
          border-color: #0ea5e9 !important;
          background: rgba(14, 165, 233, 0.1) !important;
        }

        /* Override any conflicting Ant Design styles */
        .dark-search-input .ant-input-affix-wrapper,
        .search-wrapper .ant-input-affix-wrapper,
        .search-wrapper .ant-input-search {
          background-color: rgba(30, 41, 59, 0.9) !important;
          border-color: #475569 !important;
        }

        .dark-search-input .ant-input-affix-wrapper:focus,
        .dark-search-input .ant-input-affix-wrapper-focused,
        .search-wrapper .ant-input-affix-wrapper:focus,
        .search-wrapper .ant-input-affix-wrapper-focused {
          background-color: rgba(30, 41, 59, 0.95) !important;
          border-color: #0ea5e9 !important;
          box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2) !important;
        }

        /* Force all search components to be dark */
        .search-wrapper * {
          background-color: rgba(30, 41, 59, 0.9) !important;
        }

        .search-wrapper input {
          background-color: rgba(30, 41, 59, 0.9) !important;
          color: #f8fafc !important;
        }

        /* Dark Select */
        .dark-select .ant-select-selector,
        .dark-select-tags .ant-select-selector {
          background-color: rgba(30, 41, 59, 0.8) !important;
          border-color: #475569 !important;
          color: #f8fafc !important;
        }

        .dark-select .ant-select-selection-placeholder,
        .dark-select-tags .ant-select-selection-placeholder {
          color: #94a3b8 !important;
        }

        .dark-select .ant-select-arrow,
        .dark-select-tags .ant-select-arrow {
          color: #94a3b8 !important;
        }

        .dark-select:hover .ant-select-selector,
        .dark-select-tags:hover .ant-select-selector {
          border-color: #0ea5e9 !important;
        }

        .dark-select.ant-select-focused .ant-select-selector,
        .dark-select-tags.ant-select-focused .ant-select-selector {
          border-color: #0ea5e9 !important;
          box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2) !important;
          background-color: rgba(30, 41, 59, 0.9) !important;
        }

        /* Multi-select tags */
        .dark-select-tags .ant-select-selection-item {
          background-color: rgba(59, 130, 246, 0.2) !important;
          border-color: rgba(96, 165, 250, 0.4) !important;
          color: #93c5fd !important;
        }

        .dark-select-tags .ant-select-selection-item-remove {
          color: #93c5fd !important;
        }

        .dark-select-tags .ant-select-selection-item-remove:hover {
          color: #dbeafe !important;
        }

        /* Dropdown options */
        .ant-select-dropdown {
          background-color: #1e293b !important;
        }

        .ant-select-item {
          color: #e2e8f0 !important;
        }

        .ant-select-item:hover {
          background-color: rgba(14, 165, 233, 0.1) !important;
        }

        .ant-select-item-option-selected {
          background-color: rgba(14, 165, 233, 0.2) !important;
          color: #0ea5e9 !important;
        }

        /* Clear button */
        .clear-filters-btn:hover {
          background-color: rgba(239, 68, 68, 0.2) !important;
          border-color: rgba(239, 68, 68, 0.5) !important;
          color: #fca5a5 !important;
        }

        /* Pagination */
        .ant-pagination .ant-pagination-item {
          background: rgba(30, 41, 59, 0.8) !important;
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

        .ant-pagination .ant-pagination-item:hover {
          border-color: #0ea5e9 !important;
        }

        .ant-pagination .ant-pagination-item:hover a {
          color: #0ea5e9 !important;
        }

        /* Search Suggestions Styling */
        .search-suggestions-dropdown {
          background-color: #1e293b !important;
          border-color: #475569 !important;
        }

        .search-suggestion-tag {
          background-color: rgba(51, 65, 85, 0.5) !important;
          border-color: #475569 !important;
          color: #f8fafc !important;
          font-weight: 500 !important;
        }

        .search-suggestion-tag:hover {
          background-color: rgba(59, 130, 246, 0.2) !important;
          border-color: #3b82f6 !important;
          color: #ffffff !important;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .search-suggestions-dropdown .ant-tag {
          color: #f8fafc !important;
          background-color: rgba(51, 65, 85, 0.5) !important;
          border-color: #475569 !important;
        }

        .search-suggestions-dropdown .ant-tag:hover {
          color: #ffffff !important;
          background-color: rgba(59, 130, 246, 0.2) !important;
          border-color: #3b82f6 !important;
        }
      `}</style>
    </div>
    </Suspense>
  );
}
