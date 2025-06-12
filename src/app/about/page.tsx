import Link from 'next/link';

import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { AppConfig } from '@/utils/AppConfig';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden scroll-optimized">
      <Navbar />
      {/* Main Content */}
      <section className="relative bg-slate-900 py-20">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-[1252px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="glass-card rounded-3xl p-8 lg:p-12 mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Hello, I&apos;m Dastin Darmawan</h2>
            <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
              <p>
                I love sharing my knowledge about web development, programming, and digital technologies through this blog.
                My passion lies in crafting clean code by day and capturing perfect shots by night.
              </p>
              <p>
                My journey in web development started several years ago, and since then I&apos;ve been exploring various 
                technologies including JavaScript, React, CSS, and many more. I believe in learning by doing and 
                sharing knowledge with the community.
              </p>
              <p>
                Through this blog, I aim to help fellow developers learn new skills, solve problems, and stay updated 
                with the latest trends in web development. This is where my technical precision meets creative vision.
              </p>
            </div>
          </div>

          {/* Skills and Connect Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Skills */}
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Skills & Technologies</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'JavaScript / TypeScript', level: '95%' },
                  { name: 'React.js / Next.js', level: '90%' },
                  { name: 'CSS / Tailwind CSS', level: '88%' },
                  { name: 'Node.js', level: '85%' },
                  { name: 'Git / GitHub', level: '92%' },
                ].map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-medium">{skill.name}</span>
                      <span className="text-emerald-400 text-sm">{skill.level}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full transition-all duration-1000"
                        style={{ width: skill.level }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connect */}
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🌐</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Connect With Me</h3>
              </div>
              
              <div className="space-y-4">
                <a 
                  href={AppConfig.social.linkedin} 
                  className="flex items-center gap-4 p-4 glass-card rounded-xl hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium group-hover:text-cyan-300 transition-colors">LinkedIn</div>
                    <div className="text-slate-400 text-sm">Professional network</div>
                  </div>
                </a>

                <a 
                  href={AppConfig.social.medium} 
                  className="flex items-center gap-4 p-4 glass-card rounded-xl hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.5 4.5A1.5 1.5 0 108 6a1.5 1.5 0 00-1.5-1.5zM8 8.5v7h3v-7H8z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium group-hover:text-cyan-300 transition-colors">Medium</div>
                    <div className="text-slate-400 text-sm">Writing platform</div>
                  </div>
                </a>

                <a 
                  href={AppConfig.social.instagram} 
                  className="flex items-center gap-4 p-4 glass-card rounded-xl hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium group-hover:text-cyan-300 transition-colors">GitHub</div>
                    <div className="text-slate-400 text-sm">Code repository</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 glass-card rounded-xl">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium">Email</div>
                    <div className="text-slate-400 text-sm">{AppConfig.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Link 
              href="/contact"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25"
            >
              <span className="relative z-10">Get In Touch</span>
              <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}