'use client';

import Link from 'next/link';
import { useCategoriesWithCounts } from '@/hooks/useCategories';
import { Skeleton } from 'antd';

interface CategoryCardProps {
  name: string;
  count: number;
  icon: string;
  href: string;
  color: string;
  iconBg: string;
}

const CategoryCard = ({ name, count, icon, href, color, iconBg }: CategoryCardProps) => (
  <Link href={href} className="focus:outline-none">
    <div className="group glass-card rounded-2xl hover:bg-white/10 transition-all duration-500 cursor-pointer border border-white/10 hover:border-white/20 h-[260px] sm:h-[280px] lg:h-[300px] flex flex-col focus:outline-none relative overflow-hidden">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex flex-col items-center justify-center text-center space-y-4 h-full p-6 relative z-10">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-500 relative"
          style={{ background: iconBg }}
        >
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </span>
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl" style={{ background: iconBg }}></div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300">
            {name}
          </h3>
          <p className="text-sm text-slate-400 font-medium group-hover:text-slate-300 transition-colors duration-300">
            {count} articles
          </p>
        </div>
      </div>
    </div>
  </Link>
);

const CategorySkeleton = () => (
  <div className="glass-card rounded-2xl h-[260px] sm:h-[280px] lg:h-[300px] flex flex-col border border-white/10">
    <div className="flex flex-col items-center justify-center text-center space-y-4 h-full p-6">
      <Skeleton.Avatar size={64} className="rounded-2xl" />
      <div className="space-y-2">
        <Skeleton.Input className="w-20 h-6" />
        <Skeleton.Input className="w-16 h-4" />
      </div>
    </div>
  </div>
);

const EmptyCategoriesState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
    <div className="w-24 h-24 mb-4 rounded-full bg-slate-800 flex items-center justify-center">
      <svg 
        className="w-12 h-12 text-slate-600" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" 
        />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-slate-300 mb-2">No Categories Available</h3>
    <p className="text-slate-500 text-sm max-w-md">
      Categories will appear here once content is added to the blog.
    </p>
  </div>
);

export const BrowseCategory = () => {
  const { data: categoriesData = [], isLoading, error } = useCategoriesWithCounts();

  // Function to get gradient based on category slug
  const getGradientForCategory = (slug: string): string => {
    const gradients: Record<string, string> = {
      photography: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      development: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      travel: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      food: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      activities: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
    };
    return gradients[slug] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  // Transform categories data for display
  const categories = categoriesData.map(category => ({
    name: category.name,
    count: category.article_count,
    icon: category.icon || '📝',
    href: `/category/${category.slug}`,
    color: '#FFFFFF',
    iconBg: getGradientForCategory(category.slug),
  }));

  // Simplified background elements for better performance
  const BackgroundElements = () => (
    <>
      <div className="absolute top-20 left-20 w-3 h-3 bg-cyan-400/15 rounded-full performance-optimized opacity-60"></div>
      <div className="absolute bottom-32 left-40 w-4 h-4 bg-purple-400/15 rounded-full performance-optimized opacity-50"></div>
      <div className="absolute top-1/4 left-1/6 w-24 h-24 bg-cyan-500/8 rounded-full blur-xl performance-optimized"></div>
      <div className="absolute bottom-1/4 right-1/6 w-32 h-32 bg-purple-500/8 rounded-full blur-xl performance-optimized"></div>
    </>
  );

  return (
    <section className="relative bg-gradient-category overflow-visible scroll-optimized z-5" style={{ minHeight: '500px', paddingTop: '80px', paddingBottom: '67px', marginTop: '-20px' }}>
      <BackgroundElements />

      <div className="relative max-w-[1252px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 lg:mb-16 gap-4">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <h2 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-white leading-tight tracking-[-0.02em]">
              Explore my world
            </h2>
            <div className="w-12 sm:w-16 lg:w-20 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500"></div>
          </div>
          <Link 
            href="/categories"
            className="flex items-center space-x-2 sm:space-x-3 text-slate-300 hover:text-white transition-colors duration-300 group glass-card px-4 py-2 rounded-full border border-white/20 hover:border-white/40"
          >
            <span className="text-xs sm:text-sm font-medium tracking-wide uppercase">
              explore all
            </span>
            <div className="w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
              <svg 
                className="w-3 h-3" 
                fill="currentColor" 
                viewBox="0 0 12 12"
              >
                <path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 w-full">
          {error ? (
            <div className="col-span-full">
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Unable to Load Categories</h3>
                <p className="text-slate-500 text-sm">
                  There was an error loading categories. Please try again later.
                </p>
              </div>
            </div>
          ) : isLoading ? (
            // Show skeleton loaders
            [...Array(5)].map((_, index) => (
              <CategorySkeleton key={index} />
            ))
          ) : categories.length === 0 ? (
            <EmptyCategoriesState />
          ) : (
            // Show actual categories
            categories.slice(0, 5).map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                count={category.count}
                icon={category.icon}
                href={category.href}
                color={category.color}
                iconBg={category.iconBg}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};