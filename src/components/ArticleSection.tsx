'use client';

import { useFeaturedArticles, useArticlesByCategory } from '@/hooks/useArticles';
import { ArticleCard } from '@/components/ArticleCard';
import { Section } from '@/components/Section';
import { Skeleton } from 'antd';

interface ArticleSectionProps {
  title: string;
  categorySlug?: string;
  linkHref: string;
  featured?: boolean;
  limit?: number;
}

const EmptyState = ({ title }: { title: string }) => (
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
        />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-slate-300 mb-2">No {title} Articles Yet</h3>
    <p className="text-slate-500 text-sm max-w-md">
      We&apos;re working on adding great content. Check back soon for amazing {title.toLowerCase()} articles!
    </p>
  </div>
);

const LoadingSkeleton = () => (
  <>
    {[...Array(4)].map((_, index) => (
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
  </>
);

export const ArticleSection = ({ title, categorySlug, linkHref, featured = false, limit = 4 }: ArticleSectionProps) => {
  // Use appropriate hook based on whether it's featured or category-based
  const featuredQuery = useFeaturedArticles();
  const categoryQuery = useArticlesByCategory(categorySlug || '', limit);
  
  const query = featured ? featuredQuery : categoryQuery;
  const { data: articles = [], isLoading, error } = query;

  // Take only the specified limit
  const displayArticles = articles.slice(0, limit);

  if (error) {
    return (
      <Section title={title} linkText="See All Article" linkHref={linkHref}>
        <div className="col-span-full">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">Unable to Load Articles</h3>
            <p className="text-slate-500 text-sm">
              There was an error loading {title.toLowerCase()} articles. Please try again later.
            </p>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section title={title} linkText="See All Article" linkHref={linkHref}>
      {isLoading ? (
        <LoadingSkeleton />
      ) : displayArticles.length === 0 ? (
        <EmptyState title={title} />
      ) : (
        displayArticles.map((article, index) => (
          <ArticleCard
            key={article.id || index}
            title={article.title || 'Untitled Article'}
            author={article.author_name || article.author || 'Unknown Author'}
            date={article.published_at || article.publishedAt || new Date().toISOString()}
            readTime={`${article.reading_time || 5} min read`}
            imageUrl={article.featured_image_url || article.imageUrl || '/images/default-article.jpg'}
            slug={article.slug || ''}
            isHovered={featured ? index === 0 : index === Math.floor(Math.random() * displayArticles.length)} // Add some variety
          />
        ))
      )}
    </Section>
  );
};