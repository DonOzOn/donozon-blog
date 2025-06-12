'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Button, Drawer } from 'antd';
import { MenuOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.closest('.search-container')?.contains(event.target as Node)) {
        setSearchExpanded(false);
        setSearchQuery('');
      }
    };

    if (searchExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchExpanded]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Category', href: '/categories' },
    { name: 'About Me', href: '/about' },
  ];

  return (
    <nav className="w-full glass sticky top-0 z-[100] overflow-hidden border-b border-white/10">
      <div className="max-w-[1252px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[86px]">
          {/* Logo */}
          <div className="flex items-baseline">
            <Link href="/" className="flex items-baseline focus:outline-none group">
              <span className="text-[36px] font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent leading-[1.26] group-hover:from-purple-400 group-hover:to-pink-500 transition-all duration-300">
                DonOzOn
              </span>
              <span className="text-[18px] font-bold text-cyan-400 leading-[1.26] ml-1">
                .blog
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center gap-12">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href} 
                className="text-[20px] font-bold text-slate-300 hover:text-white transition-all duration-300 uppercase tracking-wide focus:outline-none relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            
            {/* Search */}
            <div className="relative search-container">
              <div 
                className={`flex items-center gap-2.5 cursor-pointer group focus:outline-none bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 ${
                  searchExpanded 
                    ? 'px-4 py-2 rounded-xl w-[300px]' 
                    : 'px-4 py-2 rounded-full'
                }`}
                onClick={() => {
                  if (!searchExpanded) {
                    setSearchExpanded(true);
                    setTimeout(() => searchInputRef.current?.focus(), 100);
                  }
                }}
              >
                <SearchOutlined className="text-slate-300 group-hover:text-white transition-colors duration-200 text-[17px] flex-shrink-0" />
                
                {searchExpanded ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          // Handle search submission
                          console.log('Search for:', searchQuery);
                          // You can navigate to search results page here
                          // router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                        }
                        if (e.key === 'Escape') {
                          setSearchExpanded(false);
                          setSearchQuery('');
                        }
                      }}
                      placeholder="Search articles..."
                      className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-[16px] font-medium"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchExpanded(false);
                        setSearchQuery('');
                      }}
                      className="text-slate-400 hover:text-white transition-colors duration-200 p-1"
                    >
                      <CloseOutlined className="text-[14px]" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[18px] font-bold text-slate-300 group-hover:text-white transition-colors duration-200 uppercase tracking-wide">
                    Search
                  </span>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchExpanded && searchQuery.trim() && (
                <div className="search-dropdown absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-50 max-h-[400px] overflow-y-auto">
                  <div className="p-4">
                    <div className="text-slate-400 text-sm mb-3">
                      Search results for &quot;{searchQuery}&quot;
                    </div>
                    
                    {/* Mock search results - replace with actual search */}
                    <div className="space-y-3">
                      {[
                        { title: 'Fundamental of javascript', category: 'JavaScript', slug: 'fundamental-of-javascript' },
                        { title: 'Grid CSS make your life easier', category: 'CSS', slug: 'grid-css-make-your-life-easier' },
                        { title: 'Make tic tac toe games with react JS', category: 'React', slug: 'tic-tac-toe-games-react-js' },
                        { title: 'Flexbox CSS: Everything you need to know', category: 'CSS', slug: 'flexbox-css-everything-you-need-to-know' },
                        { title: 'array in javascript - Learn JS #3', category: 'JavaScript', slug: 'array-in-javascript-learn-js-3' },
                      ]
                      .filter(item => 
                        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.category.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .slice(0, 5)
                      .map((result, index) => (
                        <Link
                          key={index}
                          href={`/articles/${result.slug}`}
                          className="search-result-item block p-3 rounded-lg hover:bg-white/5 transition-all duration-200 group"
                          onClick={() => {
                            setSearchExpanded(false);
                            setSearchQuery('');
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <SearchOutlined className="text-white text-xs" />
                            </div>
                            <div className="flex-1">
                              <div className="text-white group-hover:text-emerald-300 transition-colors font-medium text-sm">
                                {result.title}
                              </div>
                              <div className="text-slate-400 text-xs mt-1">
                                {result.category}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                      
                      {searchQuery.trim() && (
                        <div className="border-t border-white/10 pt-3">
                          <Link
                            href={`/search?q=${encodeURIComponent(searchQuery)}`}
                            className="block p-3 rounded-lg hover:bg-white/5 transition-all duration-200 text-center group"
                            onClick={() => {
                              setSearchExpanded(false);
                              setSearchQuery('');
                            }}
                          >
                            <div className="text-emerald-400 group-hover:text-emerald-300 transition-colors font-medium text-sm">
                              View all results for &quot;{searchQuery}&quot;
                            </div>
                          </Link>
                        </div>
                      )}
                      
                      {/* No results message */}
                      {searchQuery.trim() && ![
                        { title: 'Fundamental of javascript', category: 'JavaScript', slug: 'fundamental-of-javascript' },
                        { title: 'Grid CSS make your life easier', category: 'CSS', slug: 'grid-css-make-your-life-easier' },
                        { title: 'Make tic tac toe games with react JS', category: 'React', slug: 'tic-tac-toe-games-react-js' },
                        { title: 'Flexbox CSS: Everything you need to know', category: 'CSS', slug: 'flexbox-css-everything-you-need-to-know' },
                        { title: 'array in javascript - Learn JS #3', category: 'JavaScript', slug: 'array-in-javascript-learn-js-3' },
                      ].some(item => 
                        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.category.toLowerCase().includes(searchQuery.toLowerCase())
                      ) && (
                        <div className="text-center py-6">
                          <div className="text-slate-400 text-sm mb-2">No results found</div>
                          <div className="text-slate-500 text-xs">Try different keywords or browse categories</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              className="text-slate-300 hover:text-white border-none shadow-none"
              size="large"
              style={{
                color: '#cbd5e1',
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <Link href="/" className="flex items-baseline" onClick={() => setMobileMenuOpen(false)}>
            <span className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">DonOzOn</span>
            <span className="text-lg font-bold text-cyan-400">.blog</span>
          </Link>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className="mobile-menu-drawer"
        zIndex={1000}
        style={{
          zIndex: 1000
        }}
        styles={{
          wrapper: {
            zIndex: 1000
          },
          mask: {
            backgroundColor: 'rgba(15, 15, 35, 0.8)',
            backdropFilter: 'blur(8px)'
          },
          content: {
            backgroundColor: '#1a1a2e',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          },
          header: {
            backgroundColor: '#1a1a2e',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#f8fafc'
          },
          body: {
            backgroundColor: '#1a1a2e',
            color: '#f8fafc'
          }
        }}
      >
        <div className="flex flex-col space-y-6 pt-6">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href} 
              className="text-lg font-bold text-slate-300 hover:text-white transition-colors duration-200 py-2 uppercase"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <button 
            className="flex items-center gap-2 py-2 cursor-pointer hover:text-white transition-colors w-full text-left"
            onClick={() => {
              setMobileMenuOpen(false);
              setSearchExpanded(true);
              setTimeout(() => searchInputRef.current?.focus(), 300);
            }}
          >
            <SearchOutlined className="text-slate-300" />
            <span className="text-lg font-bold text-slate-300 uppercase">Search</span>
          </button>
        </div>
      </Drawer>
    </nav>
  );
};