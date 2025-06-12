'use client';

import Image from 'next/image';

export const HeroSection = () => {
  // Optimized floating elements - fewer and more performant
  const FloatingElement = ({ children, className }: { children: React.ReactNode; className: string }) => (
    <div className={`personality-icon floating performance-optimized ${className}`}>
      {children}
    </div>
  );

  return (
    <section className="relative pt-4 sm:pt-0 bg-gradient-hero lg:h-[900px] flex items-center overflow-hidden scroll-optimized z-20">
      {/* Simplified background elements - reduced for performance */}
      <div className="absolute inset-0 performance-optimized">
        {/* Reduced floating elements */}
        <FloatingElement className="top-20 left-20 text-3xl opacity-60">
          <span className="text-emerald-400/30 font-mono font-bold">{'{ }'}</span>
        </FloatingElement>
        <FloatingElement className="bottom-20 right-20 text-3xl opacity-60">
          <span className="text-emerald-400/30 font-mono">$</span>
        </FloatingElement>
        <FloatingElement className="top-40 right-32 text-2xl opacity-50">
          <span className="text-red-400/30">📷</span>
        </FloatingElement>
        
        {/* Simplified gradient orbs - fewer layers */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-emerald-500/8 rounded-full blur-2xl performance-optimized"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-red-500/8 rounded-full blur-2xl performance-optimized"></div>
      </div>

      <div className="relative max-w-[1252px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Hero Content */}
          <div className="space-y-6 lg:space-y-8 z-10">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full glass-card border border-emerald-400/20">
              <span className="text-sm font-medium text-emerald-300">⚡ Building. Creating. Capturing.</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] font-bold leading-[1.1] tracking-[-0.02em]">
                <span className="block text-white">Code</span>
                <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-red-400 bg-clip-text text-transparent">
                  & Capture
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl sm:text-2xl lg:text-3xl font-light text-slate-300 leading-relaxed">
                Building digital experiences, one frame at a time
              </p>
            </div>

            {/* Description */}
            <div className="flex items-start gap-4">
              <div className="w-1 h-16 bg-gradient-to-b from-emerald-400 to-red-400 rounded-full mt-1"></div>
              <p className="text-base sm:text-lg lg:text-xl text-slate-400 leading-relaxed max-w-[600px]">
                Crafting clean code by day, hunting perfect shots by night. This is where my technical precision meets creative vision - tutorials, projects, and stories from behind the lens and the keyboard.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-8 sm:pb-0">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  📸 Portfolio
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button className="group px-8 py-4 glass-card rounded-xl font-semibold text-white border border-white/20 hover:border-emerald-400/40 transition-all duration-300 hover:bg-emerald-500/10">
                <span className="flex items-center justify-center gap-2">
                  ⚡ Latest Work
                </span>
              </button>
            </div>

            {/* Tech Stack Icons */}
            <div className="flex items-center gap-6 pt-0 sm:pt-6">
              <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Stack</span>
              <div className="flex items-center gap-4">
                {['React', 'Next.js', 'TypeScript', 'Node.js'].map((tech) => (
                  <div key={tech} className="glass-card px-3 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-colors">
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Hero Visual */}
          <div className="flex justify-center lg:justify-end z-20 mt-8 lg:mt-0">
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative w-[280px] h-[350px] sm:w-[350px] sm:h-[450px] lg:w-[470px] lg:h-[587px]">
                {/* Glass Card Background */}
                <div className="absolute inset-0 glass-card rounded-3xl"></div>
                
                {/* Profile Image */}
                <div className="absolute inset-4 rounded-2xl overflow-hidden">
                  <Image
                    src="/donozon.png" // Updated to use the local image
                    alt="Developer & Photographer"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>
                
                {/* Floating Tech Badges */}
                <div className="absolute -top-4 -left-4 glass-card p-3 rounded-xl floating">
                  <span className="text-2xl">📸</span>
                </div>
                <div className="absolute -top-2 -right-6 glass-card p-3 rounded-xl floating">
                  <span className="text-2xl">💻</span>
                </div>
                <div className="absolute -bottom-4 -left-6 glass-card p-3 rounded-xl floating">
                  <span className="text-2xl">🎨</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};