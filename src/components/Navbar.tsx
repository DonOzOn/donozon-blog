'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    // { name: 'Portfolio', href: '/portfolio' },
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
        </div>
      </Drawer>
    </nav>
  );
};