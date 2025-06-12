'use client';

import Link from 'next/link';

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
            <div className="flex flex-wrap items-center gap-3">
              {/* LinkedIn */}
              <Link 
                href="https://www.linkedin.com/in/ngo-van-don-3b3819183/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#0077B5] rounded-lg flex items-center justify-center text-white hover:bg-[#005885] transition-all duration-200 hover:scale-105"
                title="LinkedIn Profile"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </Link>
              
              {/* GitHub */}
              <Link 
                href="https://github.com/DonOzOn" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#333] rounded-lg flex items-center justify-center text-white hover:bg-[#24292e] transition-all duration-200 hover:scale-105"
                title="GitHub Profile"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </Link>
              
              {/* Facebook */}
              <Link 
                href="https://www.facebook.com/UchihaDonOzOn/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1877F2] rounded-lg flex items-center justify-center text-white hover:bg-[#166fe5] transition-all duration-200 hover:scale-105"
                title="Facebook Profile"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </Link>
              
              {/* Instagram Personal */}
              <Link 
                href="https://www.instagram.com/donozon/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-tr from-[#405DE6] via-[#5851DB] via-[#833AB4] via-[#C13584] via-[#E1306C] via-[#FD1D1D] to-[#F56040] rounded-lg flex items-center justify-center text-white hover:scale-105 transition-all duration-200"
                title="Personal Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
              
              {/* Instagram Photography */}
              <Link 
                href="https://www.instagram.com/donozon_photo/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-tr from-[#833AB4] via-[#E1306C] to-[#FD1D1D] rounded-lg flex items-center justify-center text-white hover:scale-105 transition-all duration-200"
                title="Photography Instagram"
              >
                <span className="text-xs font-bold">📸</span>
              </Link>
              
              {/* StackOverflow */}
              <Link 
                href="https://stackoverflow.com/users/12702802/don-ozon" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#F48024] rounded-lg flex items-center justify-center text-white hover:bg-[#e8700a] transition-all duration-200 hover:scale-105"
                title="StackOverflow Profile"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092L6.785 12.743zM24 22.112l-2.662-15.26-2.186.42 2.662 15.26L24 22.112zM1.89 15.47V24h9.974v-8.53H1.89zm2.133 6.397V17.6h5.71v4.267H4.023z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Footer Links - Right Side */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Professional */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wide">PROFESSIONAL</h3>
              <ul className="space-y-3 list-none">
                <li>
                  <Link href="https://www.linkedin.com/in/ngo-van-don-3b3819183/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed flex items-center gap-2">
                    <span className="text-[#0077B5]">💼</span> LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href="https://github.com/DonOzOn" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed flex items-center gap-2">
                    <span className="text-[#333]">⚡</span> GitHub
                  </Link>
                </li>
                <li>
                  <Link href="https://stackoverflow.com/users/12702802/don-ozon" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed flex items-center gap-2">
                    <span className="text-[#F48024]">📊</span> StackOverflow
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed">
                    About Me
                  </Link>
                </li>
              </ul>
            </div>

            {/* Creative & Photography */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wide">CREATIVE</h3>
              <ul className="space-y-3 list-none">
                <li>
                  <Link href="https://www.instagram.com/donozon/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed flex items-center gap-2">
                    <span className="text-[#E1306C]">📱</span> Personal
                  </Link>
                </li>
                <li>
                  <Link href="https://www.instagram.com/donozon_photo/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed flex items-center gap-2">
                    <span className="text-[#E1306C]">📸</span> Photography
                  </Link>
                </li>
                <li>
                  <Link href="https://www.facebook.com/UchihaDonOzOn/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed flex items-center gap-2">
                    <span className="text-[#1877F2]">👥</span> Facebook
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed">
                    View All Categories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Connect */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wide">CONNECT</h3>
              <ul className="space-y-3 list-none">
                <li>
                  <Link href="mailto:sky.knight.dn97@gmail.com" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed flex items-center gap-2">
                    <span className="text-red-400">✉️</span> Email Me
                  </Link>
                </li>
                <li className="text-slate-400 text-sm leading-relaxed">
                  📸 Available for photo shoots
                </li>
                <li className="text-slate-400 text-sm leading-relaxed">
                  💻 Open for collaborations
                </li>
                <li>
                  <Link href="/contact" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm leading-relaxed">
                    Contact Form
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="text-slate-400 text-sm">
                © 2025 <span className="text-cyan-400 font-medium">Ngo Van Don (DonOzOn)</span>
              </p>
              <span className="hidden md:block text-slate-600">•</span>
              <p className="text-slate-500 text-xs">
                Built with ❤️ using Next.js, TypeScript & Supabase
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};