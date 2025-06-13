'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { format } from 'date-fns';

interface ArticleCardProps {
  title: string;
  author: string;
  date: string;
  readTime: string | number;
  imageUrl: string;
  slug: string;
  isHovered?: boolean;
  excerpt?: string;
  category?: string;
  tags?: string[];
}

// Utility function to safely format dates
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Recent';
    }
    return format(date, 'MMM dd, yyyy');
  } catch {
    return 'Recent';
  }
};

// Utility function to ensure consistent read time format
const formatReadTime = (readTime: string | number): string => {
  if (typeof readTime === 'number') {
    return `${readTime} min read`;
  }
  if (typeof readTime === 'string') {
    // If it already includes "min read", return as is
    if (readTime.includes('min read')) {
      return readTime;
    }
    // If it's just a number string, add "min read"
    const numMatch = readTime.match(/\d+/);
    if (numMatch) {
      return `${numMatch[0]} min read`;
    }
  }
  return '5 min read'; // Default fallback
};

export const ArticleCard = ({ 
  title, 
  author, 
  date, 
  readTime, 
  imageUrl, 
  slug, 
  isHovered = false,
  excerpt,
  category,
  tags
}: ArticleCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Standardize the data
  const standardizedData = {
    title: title || 'Untitled Article',
    author: author || 'DonOzOn',
    date: formatDate(date),
    readTime: formatReadTime(readTime),
    imageUrl: imageUrl || '/images/default-article.jpg',
    slug: slug || '',
    excerpt: excerpt || '',
    category: category || '',
    tags: tags || []
  };

  return (
    <Link href={`/articles/${standardizedData.slug}`} className="block w-full focus:outline-none">
      <article className={`
        glass-card rounded-xl transition-all duration-300 cursor-pointer border border-white/10 w-full max-w-full h-full focus:outline-none group relative overflow-hidden
        ${isHovered 
          ? 'hover:border-white/30 transform translate-y-[-4px] shadow-2xl shadow-cyan-500/10' 
          : 'hover:border-white/30 hover:transform hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-cyan-500/10'
        }
      `}>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="flex flex-col h-full relative z-10">
          {/* Article Image - Consistent aspect ratio */}
          <div className="aspect-video relative rounded-t-xl overflow-hidden flex-shrink-0">
            {isLoading && (
              <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-slate-600 border-t-cyan-400 rounded-full animate-spin"></div>
              </div>
            )}
            {!imageError ? (
              <Image
                src={standardizedData.imageUrl}
                alt={standardizedData.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                onError={handleImageError}
                onLoad={handleImageLoad}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs">Image not available</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            
            {/* Category badge - only show if category exists */}
            {standardizedData.category && (
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 backdrop-blur-sm">
                  {standardizedData.category}
                </span>
              </div>
            )}
          </div>

          {/* Content Container - Consistent height and spacing */}
          <div className="flex flex-col flex-grow p-4 sm:p-5 min-h-[160px] justify-between">
            {/* Article Title - Fixed height for consistency */}
            <div className="h-[60px] flex items-start mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-white leading-[1.26] line-clamp-2 tracking-tight group-hover:text-cyan-300 transition-colors duration-300">
                {standardizedData.title}
              </h3>
            </div>

            {/* Excerpt - Optional, only show if provided */}
            {standardizedData.excerpt && (
              <div className="mb-4 flex-grow">
                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                  {standardizedData.excerpt}
                </p>
              </div>
            )}

            {/* Tags - Optional, only show if provided */}
            {standardizedData.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {standardizedData.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
                      #{tag}
                    </span>
                  ))}
                  {standardizedData.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-slate-400">
                      +{standardizedData.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Author and Meta - Fixed position at bottom */}
            <div className="flex items-center space-x-[15px] mt-auto">
              <div className="w-[48px] h-[48px] sm:w-[57px] sm:h-[57px] bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/20">
                <span className="text-xs sm:text-sm font-semibold text-cyan-300">
                  {standardizedData.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col space-y-1 min-w-0 flex-grow">
                <span className="text-sm sm:text-base font-semibold text-slate-200 leading-[1.26] truncate group-hover:text-white transition-colors duration-300">
                  {standardizedData.author}
                </span>
                <span className="text-xs sm:text-sm font-normal text-slate-400 leading-[1.26] tracking-[0.05em] uppercase truncate group-hover:text-slate-300 transition-colors duration-300">
                  {standardizedData.date} • {standardizedData.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};