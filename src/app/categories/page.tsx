import Link from 'next/link';

import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { sampleArticles } from '@/lib/articles';

interface CategoryCardProps {
  name: string;
  count: number;
  icon: string;
  href: string;
  color: string;
  iconBg: string;
  description: string;
}

const CategoryCard = ({ name, count, icon, href, color, iconBg, description }: CategoryCardProps) => (
  <Link href={href} className="focus:outline-none">
    <div className="group glass-card rounded-2xl hover:bg-white/10 transition-all duration-500 cursor-pointer border border-white/10 hover:border-white/20 h-[280px] flex flex-col focus:outline-none relative overflow-hidden">
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
          <p className="text-sm text-slate-400 font-medium group-hover:text-slate-300 transition-colors duration-300 mb-3">
            {count} articles
          </p>
          <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  </Link>
);

export default function CategoriesPage() {
  // Calculate article counts dynamically
  const getArticleCount = (category: string) => {
    return sampleArticles.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    ).length;
  };

  const categories = [
    { 
      name: 'Photography', 
      count: getArticleCount('photography'), 
      icon: '📸', 
      href: '/category/photography',
      color: '#FFFFFF',
      iconBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      description: 'Capturing moments, techniques, and visual storytelling'
    },
    { 
      name: 'Development', 
      count: getArticleCount('development'), 
      icon: '💻', 
      href: '/category/development',
      color: '#FFFFFF',
      iconBg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      description: 'Web development, programming, and technical tutorials'
    },
    { 
      name: 'Travel', 
      count: getArticleCount('travel'), 
      icon: '✈️', 
      href: '/category/travel',
      color: '#FFFFFF',
      iconBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: 'Travel guides, destinations, and adventure stories'
    },
    { 
      name: 'Food', 
      count: getArticleCount('food'), 
      icon: '🍽️', 
      href: '/category/food',
      color: '#FFFFFF',
      iconBg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      description: 'Culinary adventures, recipes, and food culture'
    },
    { 
      name: 'Activities', 
      count: getArticleCount('activities'), 
      icon: '🏔️', 
      href: '/category/activities',
      color: '#FFFFFF',
      iconBg: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
      description: 'Outdoor adventures, sports, and recreational activities'
    },
  ];

  const totalArticles = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden scroll-optimized">
      <Navbar />
      {/* Categories Section */}
      <section className="relative bg-slate-900 py-20">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-[1252px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 gap-4">
            <div className="flex items-center space-x-6">
              <h2 className="text-2xl sm:text-[32px] font-bold text-white leading-tight tracking-[-0.02em]">
                All Categories
              </h2>
              <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500"></div>
            </div>
            
            <Link 
              href="/articles"
              className="flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-300 group glass-card px-4 py-2 rounded-full border border-white/20 hover:border-white/40"
            >
              <span className="text-sm font-medium tracking-wide uppercase">
                View All Articles
              </span>
              <div className="w-5 h-5 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                count={category.count}
                icon={category.icon}
                href={category.href}
                color={category.color}
                iconBg={category.iconBg}
                description={category.description}
              />
            ))}
          </div>

          {/* Popular Topics */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Popular Topics</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Portrait Photography', 'Web Development', 'Solo Travel', 'Street Food', 
                'Mountain Hiking', 'Digital Photography', 'Budget Travel', 'Asian Cuisine', 
                'Outdoor Adventures', 'Food Culture', 'Travel Safety', 'Cooking Tips'
              ].map((topic) => (
                <button
                  key={topic}
                  className="px-4 py-2 glass-card rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  #{topic.replace(' ', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter CTA */}
          {/* <div className="mt-20 text-center">
            <div className="glass-card rounded-2xl p-8 lg:p-12 max-w-2xl mx-auto">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Stay Updated
              </h3>
              <p className="text-slate-300 mb-6">
                Get notified when new articles are published in your favorite categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg font-semibold text-white hover:scale-105 transition-transform duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      <Footer />
    </div>
  );
}