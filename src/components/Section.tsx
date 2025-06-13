'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  linkText?: string;
  linkHref?: string;
  children: ReactNode;
}

export const Section = ({ title, linkText = "See All Article", linkHref = "#", children }: SectionProps) => {
  return (
    <section className="bg-slate-900 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-2xl"></div>
      </div>
      
      <div className="max-w-[1252px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <h2 className="text-2xl sm:text-[32px] font-bold text-white leading-tight tracking-[-0.02em]">
              {title}
            </h2>
            <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500"></div>
          </div>
          <Link 
            href={linkHref}
            className="flex items-center space-x-2 sm:space-x-3 text-slate-300 hover:text-white transition-all duration-300 group glass-card px-4 py-2 rounded-full border border-white/20 hover:border-white/40"
          >
            <span className="text-xs sm:text-sm font-medium tracking-wide uppercase">
              {linkText}
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

        {/* Section Content - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {children}
        </div>
      </div>
    </section>
  );
};