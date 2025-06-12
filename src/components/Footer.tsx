'use client';

import Link from 'next/link';

import { AppConfig } from '@/utils/AppConfig';

export const Footer = () => {
  return (
    <footer className="bg-slate-800 text-slate-200 border-t border-white/10">
      <div className="max-w-[1252px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* About Website - Left Side */}
          <div className="lg:col-span-4 space-y-6">
            {/* Logo */}
            <div className="flex items-baseline space-x-1">
              <span className="text-[28px] font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">DonOzOn</span>
              <span className="text-[18px] font-bold text-cyan-400">.blog</span>
            </div>
            
            {/* Description */}
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Where development meets photography - sharing code, captures, and creative insights.
            </p>
            
            {/* Social Media Links */}
            <div className="flex items-center space-x-4">
              {/* Medium - Filled */}
              <Link 
                href={AppConfig.social.medium} 
                className="w-10 h-10 bg-[#2B2C34] rounded-lg flex items-center justify-center text-white hover:bg-[#1a1d23] transition-all duration-200"
              >
                <span className="text-sm font-bold">M</span>
              </Link>
              
              {/* Twitter - Outlined */}
              <Link 
                href={AppConfig.social.twitter} 
                className="w-10 h-10 bg-transparent border border-[#9CA3AF] rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#2B2C34] hover:border-[#2B2C34] transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </Link>
              
              {/* Instagram - Outlined */}
              <Link 
                href={AppConfig.social.instagram} 
                className="w-10 h-10 bg-transparent border border-[#9CA3AF] rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#2B2C34] hover:border-[#2B2C34] transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
              
              {/* LinkedIn - Outlined */}
              <Link 
                href={AppConfig.social.linkedin} 
                className="w-10 h-10 bg-transparent border border-[#9CA3AF] rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#2B2C34] hover:border-[#2B2C34] transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Footer Links - Right Side */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8">
            {/* Category */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wide">PORTFOLIO</h3>
              <ul className="space-y-3 list-none">
                <li>
                  <Link href="/category/photography" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed">
                    Photography
                  </Link>
                </li>
                <li>
                  <Link href="/category/development" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed">
                    Development
                  </Link>
                </li>
                <li>
                  <Link href="/category/react" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed">
                    React Projects
                  </Link>
                </li>
                <li>
                  <Link href="/category/tutorials" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed">
                    View All
                  </Link>
                </li>
              </ul>
            </div>

            {/* About Me */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wide">CREATIVE</h3>
              <ul className="space-y-3 list-none">
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed">
                    About Me
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed">
                    Code & Shots
                  </Link>
                </li>
                <li>
                  <Link href="/achievement" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed">
                    Gallery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get In Touch */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wide">CONNECT</h3>
              <ul className="space-y-3 list-none">
                <li className="text-slate-400 text-sm leading-relaxed">
                  📧 hello@DonOzOn.blog
                </li>
                <li className="text-slate-400 text-sm leading-relaxed">
                  📸 Available for shoots
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wide">SOCIALS</h3>
              <ul className="space-y-3 list-none">
                <li>
                  <Link href={AppConfig.social.medium} className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed">
                    Medium
                  </Link>
                </li>
                <li>
                  <Link href={AppConfig.social.instagram} className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href={AppConfig.social.twitter} className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href={AppConfig.social.facebook} className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed">
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="border-t border-[#D1D5DB] mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#9CA3AF] text-sm">
              © 2025 DonOzOn + Claude + MCP
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};