/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const skills = {
    mobile: [
      { name: 'Flutter', years: '4+', level: 90, icon: '🎯' },
      { name: 'React Native', years: '4+', level: 95, icon: '⚛️' },
      { name: 'React JS', years: '4+', level: 90, icon: '⚛️' },
      { name: 'Cordova', years: '2+', level: 75, icon: '📱' },
      { name: 'Android Kotlin', years: '1', level: 30, icon: '🤖' }
    ],
    backend: [
      { name: 'Java Spring', years: '1', level: 30, icon: '☕' },
    ],
    cloud: [
      { name: 'AWS', years: '1', level: 30, icon: '☁️' },
      { name: 'Azure', years: '2+', level: 50, icon: '🔷' },
      { name: 'Firebase', years: '4+', level: 90, icon: '🔥' }
    ],
    database: [
      { name: 'MySQL', years: '1+', level: 30, icon: '🐬' },
      { name: 'PostgreSQL', years: '1', level: 30, icon: '🐘' },
      { name: 'SQL Server', years: '1', level: 30, icon: '🗄️' }
    ]
  };

  const projects = [
    // FPT SOFTWARE Projects
    {
      title: 'PTICare - Insurance App',
      client: 'Vietnam',
      teamSize: 13,
      company: 'FPT SOFTWARE',
      period: '2021-current',
      tech: ['Flutter', 'Bloc', 'Hive', 'Firebase Notification', 'Firebase Analytics', 'OCR'],
      description: 'Mobile app for insurance information with Firebase analytics, push notifications, and OCR verification for ID cards and faces.',
      responsibilities: [
        'Develop new features and make estimation for each sprint',
        'Support code review',
        'Trace user with Firebase analytics and push notification with Firebase',
        'Verification with OCR (scan IDCard and Face)',
        'Work with insurance business'
      ],
      programmingLanguage: 'Dart',
      image: '/projects/pticare.jpg',
      category: 'Insurance',
      status: 'Live'
    },
    {
      title: 'Digifarm - Agriculture Investment',
      client: 'Vietnam',
      teamSize: 15,
      company: 'FPT SOFTWARE',
      period: '2021-current',
      tech: ['Flutter', 'Cubit', 'Google Maps', 'Formik', 'Weather API', 'Firebase Notification'],
      description: 'Mobile app for agricultural investment with map integration, weather information, and multiple form handling.',
      responsibilities: [
        'Develop new features and make estimation for each sprint',
        'Help other team member for finding solution and review code',
        'Push notification with Firebase',
        'Show marker and polygon on Google map',
        'Fix bugs and review codes',
        'Show weather information base on user location',
        'Work with multiple form'
      ],
      programmingLanguage: 'Dart',
      image: '/projects/digifarm.jpg',
      category: 'Agriculture',
      status: 'Live'
    },
    {
      title: 'DealPipe - Investment Management',
      client: 'GIC Singapore',
      teamSize: 20,
      company: 'FPT SOFTWARE',
      period: '2021-current',
      tech: ['Flutter', 'AWS', 'CI/CD'],
      description: 'Mobile and web app for investment management system with AWS deployment and CI/CD pipeline.',
      responsibilities: [
        'Analyze requirement and provide solution',
        'Make estimation for each sprint',
        'Develop new features and do unit test',
        'Fix bugs and review codes',
        'Build IOS, Android and release store',
        'Deployment web by CI/CD on AWS'
      ],
      programmingLanguage: 'Dart',
      image: '/projects/dealpipe.jpg',
      category: 'Enterprise',
      status: 'Live'
    },
    {
      title: 'ROTF - Oil Process Management',
      client: 'PETRONAS Malaysia',
      teamSize: 16,
      company: 'FPT SOFTWARE',
      period: '2021-current',
      tech: ['Flutter', 'Azure', 'Firebase', 'SonarCloud'],
      description: 'Mobile app to manage reports of oil extraction processes with Azure CI/CD and code quality scanning.',
      responsibilities: [
        'Analyze requirement and provide solution',
        'Make estimation for each sprint',
        'Develop new features and do unit test',
        'Follow up with issues along with BE',
        'Fix bugs and review codes',
        'Manage CI/CD on Azure and release to store',
        'Integrate code quality scanning with Sonar Cloud'
      ],
      programmingLanguage: 'Dart',
      image: '/projects/rotf.jpg',
      category: 'Oil & Gas',
      status: 'Live'
    },
    {
      title: 'Pivot App - Report Management',
      client: 'PETRONAS Malaysia',
      teamSize: 15,
      company: 'FPT SOFTWARE',
      period: '2021-current',
      tech: ['Flutter', 'Firebase', 'Chart'],
      description: 'Mobile app for report management of PETRONAS company with responsive design for mobile and tablet.',
      responsibilities: [
        'Analyze requirement and provide solution',
        'Make responsive on mobile and tablet',
        'Showing chart information base on data from BE',
        'Fix bugs and review codes',
        'Manage CI/CD on Azure and push app to App Center',
        'Integrate code quality scanning with Sonar Cloud'
      ],
      programmingLanguage: 'Dart',
      image: '/projects/pivot.jpg',
      category: 'Oil & Gas',
      status: 'Live'
    },
    {
      title: 'WCO - Device Connection',
      client: 'Lam US',
      teamSize: 8,
      company: 'FPT SOFTWARE',
      period: '2021-current',
      tech: ['Cordova', 'Android', 'Speech-To-Text', 'Bluetooth'],
      description: 'Mobile app for device connection with Bluetooth integration and custom speech recognition library.',
      responsibilities: [
        'Analyze requirement and provide solution',
        'Make estimation for each task',
        'Connect with bluetooth device (headphone, screwdriver)',
        'Create new library for speech recognition use VOISK api',
        'Fix bugs and review codes',
        'Build android and release app'
      ],
      programmingLanguage: 'Javascript',
      image: '/projects/wco.jpg',
      category: 'IoT',
      status: 'Live'
    },
    {
      title: 'MOMO Wallet',
      client: 'Momo Vietnam',
      teamSize: 10,
      company: 'FPT SOFTWARE',
      period: '2021-current',
      tech: ['React Native', 'Redux', 'Saga', 'Mini App'],
      description: 'Mobile wallet application with fund investment integration and comprehensive testing suite.',
      responsibilities: [
        'Make estimation for each task',
        'Integrate fund investment from other service',
        'Write unit test',
        'Build android and IOS for testing purpose'
      ],
      programmingLanguage: 'Javascript',
      image: '/projects/momo.jpg',
      category: 'Fintech',
      status: 'Live'
    },
    // VIETTEL POST Projects
    {
      title: 'VIETTEL POST Mobile App',
      client: 'VIETTEL POST',
      teamSize: 20,
      company: 'VIETTEL POST',
      period: '8/2021 - 8/2022',
      tech: ['Flutter', 'Bloc', 'Firebase Notification'],
      description: 'Mobile application for VIETTEL POST services with fund investment integration from other VIETTEL services.',
      responsibilities: [
        'Analyze requirement and provide solution',
        'Make estimation for each sprint',
        'Develop new features and do unit test',
        'Integrate fund investment from other VIETTEL service',
        'Follow up with issues along with BE',
        'Fix bugs and review codes',
        'Build Android, IOS and release to store'
      ],
      programmingLanguage: 'Dart',
      image: '/projects/viettelpost.jpg',
      category: 'Logistics',
      status: 'Live'
    },
    // SOLID TECH Projects
    {
      title: 'Fengshui App',
      client: 'SOLID TECH',
      teamSize: 8,
      company: 'SOLID TECH',
      period: '6/2019 - 8/2021',
      tech: ['React Native', 'Redux', 'Saga', 'CodePush', 'STRINGEE'],
      description: 'Social network application with integrated calling features and fengshui services.',
      responsibilities: [
        'Develop call integration with STRINGEE',
        'Build social network features (feed, page, group)',
        'Implement real-time communication',
        'Code review and bug fixes'
      ],
      programmingLanguage: 'Javascript',
      image: '/projects/fengshui.jpg',
      category: 'Social',
      status: 'Live'
    },
    {
      title: 'Bluezone App',
      client: 'SOLID TECH',
      teamSize: 6,
      company: 'SOLID TECH',
      period: '6/2019 - 8/2021',
      tech: ['React Native', 'Redux', 'Saga', 'Firebase'],
      description: 'Contact tracing and health monitoring application with calendar and notification features.',
      responsibilities: [
        'Develop function calendar',
        'Implement notification event system',
        'Image handling and processing',
        'Firebase integration for real-time data'
      ],
      programmingLanguage: 'Javascript',
      image: '/projects/bluezone.jpg',
      category: 'Healthcare',
      status: 'Live'
    },
    {
      title: 'Dental Clinic Management App',
      client: 'SOLID TECH',
      teamSize: 5,
      company: 'SOLID TECH',
      period: '6/2019 - 8/2021',
      tech: ['React Native', 'Redux', 'Saga', 'Firebase'],
      description: 'Comprehensive dental clinic management system with appointment scheduling and staff management.',
      responsibilities: [
        'Develop function calendar',
        'Schedule appointment system',
        'Management features for dental clinic staff',
        'Patient record management'
      ],
      programmingLanguage: 'Javascript',
      image: '/projects/dental.jpg',
      category: 'Healthcare',
      status: 'Live'
    },
    {
      title: 'Ceramic Product System',
      client: 'SOLID TECH',
      teamSize: 12,
      company: 'SOLID TECH',
      period: '6/2019 - 8/2021',
      tech: ['Java Spring', 'React Native', 'Angular 7', 'CodePush', 'Redux', 'Saga'],
      description: 'Full-stack system for ceramic company managing production processes and staff operations.',
      responsibilities: [
        'Maintain mobile app and web app',
        'Develop production process tracking',
        'Staff management system',
        'Cross-platform deployment',
        'Database design and optimization'
      ],
      programmingLanguage: 'Java/Javascript',
      image: '/projects/ceramic.jpg',
      category: 'Manufacturing',
      status: 'Live'
    },
    {
      title: 'Driver Access Control System',
      client: 'SOLID TECH',
      teamSize: 8,
      company: 'SOLID TECH',
      period: '6/2019 - 8/2021',
      tech: ['Angular 7', 'Spring', 'Ado .Net', 'Winform'],
      description: 'Desktop and web application for traffic control using card and fingerprint authentication.',
      responsibilities: [
        'Desktop app to control check-in checkout of traffic at company',
        'Card and fingerprint authentication system',
        'Develop web-application to manage employee and staff time-sheet',
        'Synchronize data from Fingerprint Reader desktop application through API',
        'Driver management system'
      ],
      programmingLanguage: 'Java/C#',
      image: '/projects/driver-control.jpg',
      category: 'Security',
      status: 'Live'
    },
    // University Projects
    {
      title: 'Capstone Project - Full Stack Web Application',
      client: 'FPT University',
      teamSize: 4,
      company: 'FPT University',
      period: '9/2019 - 12/2019',
      tech: ['Angular 7', 'Spring Boot', 'MySQL'],
      description: 'University capstone project demonstrating full-stack development skills with modern technologies.',
      responsibilities: [
        'Code front-end using HTML, SCSS and TypeScript, Angular',
        'Code back-end using Java Spring(boot)',
        'Database design and implementation',
        'Full software development lifecycle experience'
      ],
      programmingLanguage: 'Java/TypeScript',
      image: '/projects/capstone.jpg',
      category: 'Academic',
      status: 'Completed'
    }
  ];

  const products = [
    {
      id: 'recipe-flavorist',
      name: 'Recipe Flavorist',
      tagline: 'Discover Delicious Recipes',
      description: 'A comprehensive recipe discovery app that helps users find, save, and organize their favorite recipes. Features include recipe search, categorization, step-by-step cooking instructions, and personal recipe collections.',
      platform: 'Android',
      status: 'Published',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.recipeflavorist',
      packageId: 'com.recipeflavorist',
      category: 'Food & Drink',
      version: '1.0+',
      features: [
        'Recipe Search & Discovery',
        'Step-by-step Cooking Instructions',
        'Recipe Collections & Favorites',
        'Category-based Organization',
        'Offline Recipe Storage',
        'Beautiful User Interface',
        'Recipe Sharing',
        'Cooking Timer Integration'
      ],
      technologies: [
        'Flutter',
        'Dart',
        'Firebase',
        'REST API',
        'Local Storage',
        'Material Design'
      ],
      screenshots: [
        '/products/recipe-flavorist/screenshot1.jpg',
        '/products/recipe-flavorist/screenshot2.jpg',
        '/products/recipe-flavorist/screenshot3.jpg',
        '/products/recipe-flavorist/screenshot4.jpg'
      ],
      icon: '🍳',
      color: 'from-orange-600 to-red-600',
      downloadCount: '100+',
      rating: '4.5',
      lastUpdated: '2024',
      size: '15MB',
      targetSdk: 'Android 7.0+',
      permissions: [
        'Internet access for recipe data',
        'Storage for offline recipes',
        'Camera for recipe photos'
      ],
      highlights: [
        'Clean and intuitive user interface',
        'Fast recipe search and filtering',
        'Offline functionality for saved recipes',
        'Material Design principles',
        'Optimized performance'
      ]
    }
  ];

  const experience = [
    {
      company: 'FPT SOFTWARE',
      role: 'Flutter Developer',
      period: '8/2021 - current',
      logo: '/companies/fpt.png',
      projects: ['PTICare', 'DealPipe', 'ROTF', 'MOMO Wallet', 'WCO', 'Digifarm']
    },
    {
      company: 'VIETTEL POST',
      role: 'React Native Developer',
      period: '8/2021 - 8/2022',
      logo: '/companies/viettel.png',
      projects: ['VIETTEL POST Mobile App']
    },
    {
      company: 'SOLID TECH',
      role: 'Java & Mobile Developer',
      period: '6/2019 - 8/2021',
      logo: '/companies/solid.png',
      projects: ['Fengshui App', 'Bluezone App', 'Dental Clinic App', 'Ceramic System']
    }
  ];

  const certifications = [
    {
      name: 'Azure Fundamentals Microsoft Certified (AZ-900)',
      issuer: 'Microsoft',
      year: '2022',
      logo: '/cert/azure.png',
      credentialUrl: 'https://www.credly.com/badges/41ee9bb4-f428-4d6f-81fe-20c9fc8ef6b9'
    },
    {
      name: 'Android Kotlin Developer',
      issuer: 'Udacity',
      year: '2022',
      logo: '/cert/android.png',
      credentialUrl: 'https://graduation.udacity.com/api/graduation/certificate/QDQK9RFT/download'
    }
  ];

  const SkillBar = ({ skill }: { skill: { name: string; years: string; level: number; icon: string } }) => (
    <div className="glass-card p-6 rounded-xl hover:bg-white/5 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{skill.icon}</span>
          <div>
            <h3 className="font-semibold text-white">{skill.name}</h3>
            <p className="text-sm text-slate-400">{skill.years} years</p>
          </div>
        </div>
        <span className="text-emerald-400 font-bold">{skill.level}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full transition-all duration-1000"
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </div>
  );

  const ProjectCard = ({ project }: { project: any }) => (
    <div className="glass-card rounded-2xl overflow-hidden hover:bg-white/5 transition-all duration-300 group">
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-emerald-600/20 to-cyan-600/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl sm:text-6xl opacity-50">
            {project.category === 'Insurance' && '🛡️'}
            {project.category === 'Agriculture' && '🌾'}
            {project.category === 'Enterprise' && '🏢'}
            {project.category === 'Oil & Gas' && '⛽'}
            {project.category === 'IoT' && '📡'}
            {project.category === 'Fintech' && '💰'}
            {project.category === 'Logistics' && '📦'}
            {project.category === 'Social' && '👥'}
            {project.category === 'Healthcare' && '🏥'}
            {project.category === 'Manufacturing' && '🏭'}
            {project.category === 'Security' && '🔐'}
            {project.category === 'Academic' && '🎓'}
          </div>
        </div>
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
          <span className="inline-block px-2 sm:px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded-full">
            {project.category}
          </span>
        </div>
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
          <span className={`inline-block px-2 sm:px-3 py-1 text-white text-xs font-medium rounded-full ${
            project.status === 'Live' ? 'bg-green-600' : 'bg-blue-600'
          }`}>
            {project.status}
          </span>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg sm:text-xl font-bold text-white truncate pr-2">{project.title}</h3>
          <span className="text-xs text-slate-400 flex-shrink-0">{project.period}</span>
        </div>
        <p className="text-slate-400 text-sm mb-2">{project.client} • Team: {project.teamSize}</p>
        <p className="text-emerald-400 text-sm font-medium mb-3">{project.company}</p>
        <p className="text-slate-300 mb-4 line-clamp-3 text-sm sm:text-base">{project.description}</p>
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
          {project.tech.slice(0, 3).map((tech: string) => (
            <span key={tech} className="px-2 py-1 bg-slate-700 text-emerald-400 text-xs rounded">
              {tech}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded">
              +{project.tech.length - 3} more
            </span>
          )}
        </div>
        <button 
          onClick={() => {
            setSelectedProject(project);
            setIsModalOpen(true);
          }}
          className="text-emerald-400 hover:text-emerald-300 font-medium text-sm transition-colors"
        >
          View Details →
        </button>
      </div>
    </div>
  );

  // Project Detail Modal Component
  const ProjectDetailModal = () => {
    if (!selectedProject || !mounted) return null;

    const modalContent = (
      <div 
        className={`fixed inset-0 z-[9999] transition-all duration-300 ${
          isModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999
        }}
        onClick={() => setIsModalOpen(false)}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        />
        
        {/* Modal Container - Centered */}
        <div 
          className="absolute inset-0 flex items-center justify-center p-4"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          {/* Modal Content */}
          <div 
            className="relative bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-600"
            style={{
              background: '#1e293b',
              borderRadius: '1rem',
              border: '1px solid #475569',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              transform: isModalOpen ? 'scale(1)' : 'scale(0.95)',
              transition: 'transform 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-600 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">{selectedProject.title}</h2>
                    <span className={`px-3 py-1 text-white text-sm font-medium rounded-full ${
                      selectedProject.status === 'Live' ? 'bg-green-600' : 'bg-blue-600'
                    }`}>
                      {selectedProject.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-slate-300">
                    <span className="flex items-center gap-2">
                      <span className="text-emerald-400">🏢</span>
                      {selectedProject.company}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-emerald-400">🌍</span>
                      {selectedProject.client}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-emerald-400">👥</span>
                      Team: {selectedProject.teamSize}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-emerald-400">📅</span>
                      {selectedProject.period}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-shrink-0 w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
              <div className="p-6 space-y-8">
                {/* Project Overview */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-emerald-400">📋</span>
                    Project Overview
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Technologies Used */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-emerald-400">🛠️</span>
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.tech.map((tech: string) => (
                      <span 
                        key={tech} 
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border border-emerald-500/30 text-emerald-300 rounded-lg font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-400 text-sm">Programming Language: </span>
                    <span className="text-emerald-400 font-medium">{selectedProject.programmingLanguage}</span>
                  </div>
                </div>

                {/* Key Responsibilities */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-emerald-400">🎯</span>
                    Key Responsibilities
                  </h3>
                  <div className="space-y-3">
                    {selectedProject.responsibilities.map((responsibility: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                        <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{responsibility}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Category & Impact */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-emerald-600/10 to-cyan-600/10 rounded-xl border border-emerald-500/20">
                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="text-emerald-400">🏷️</span>
                      Category
                    </h4>
                    <p className="text-emerald-300 text-lg font-medium">{selectedProject.category}</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-xl border border-purple-500/20">
                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="text-purple-400">📊</span>
                      Project Scale
                    </h4>
                    <p className="text-purple-300">
                      {selectedProject.teamSize > 15 ? 'Large Scale' : selectedProject.teamSize > 8 ? 'Medium Scale' : 'Small Scale'} Project
                    </p>
                    <p className="text-slate-400 text-sm mt-1">{selectedProject.teamSize} team members</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    // Use portal to render at document body level
    return createPortal(modalContent, document.body);
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden scroll-optimized">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 bg-gradient-to-br from-slate-900 via-emerald-950/10 to-slate-900">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-[1252px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Profile Image */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 p-1">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                  <span className="text-2xl sm:text-4xl">👨‍💻</span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              Ngo Van Don
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-emerald-400 mb-3 sm:mb-4">
              Senior React Native and Flutter Developer
            </p>
            <p className="text-base sm:text-lg text-slate-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4 sm:px-0">
              5+ years of experience in software development, specializing in Flutter and React Native. 
              Passionate about building scalable mobile applications and working with cutting-edge technologies.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0">
              <div className="glass-card p-3 sm:p-4 rounded-xl text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">5+</div>
                <div className="text-xs sm:text-sm text-slate-400">Years Experience</div>
              </div>
              <div className="glass-card p-3 sm:p-4 rounded-xl text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">15+</div>
                <div className="text-xs sm:text-sm text-slate-400">Projects Completed</div>
              </div>
              <div className="glass-card p-3 sm:p-4 rounded-xl text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">10+</div>
                <div className="text-xs sm:text-sm text-slate-400">Technologies</div>
              </div>
              <div className="glass-card p-3 sm:p-4 rounded-xl text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">2</div>
                <div className="text-xs sm:text-sm text-slate-400">Certifications</div>
              </div>
            </div>

            {/* Contact Links */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <a 
                href="https://github.com/DonOzOn" 
                target="_blank"
                className="glass-card px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
              >
                🔗 GitHub
              </a>
              <a 
                href="https://stackoverflow.com/users/12702802/don-ozon" 
                target="_blank"
                className="glass-card px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
              >
                📚 StackOverflow
              </a>
              <a 
                href="/contact"
                className="glass-card px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
              >
                📧 Contact Me
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-16 sm:top-20 z-30 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-[1252px] mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-2 sm:gap-4 lg:gap-8 py-3 sm:py-4">
            {[
              { id: 'overview', label: 'Overview', icon: '🏠' },
              { id: 'skills', label: 'Skills', icon: '🛠️' },
              { id: 'projects', label: 'Projects', icon: '🚀' },
              { id: 'products', label: 'Products', icon: '📱' },
              { id: 'experience', label: 'Experience', icon: '💼' },
              { id: 'certifications', label: 'Certs', icon: '🏆' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-300 text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="text-sm sm:text-base">{tab.icon}</span>
                <span className="hidden xs:inline sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-[1252px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Overview Section */}
        {activeTab === 'overview' && (
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6">About Me</h2>
              <p className="text-lg text-slate-300 max-w-4xl mx-auto leading-relaxed">
                I'm a dedicated software developer with 5+ years of experience, specializing in mobile application development. 
                My expertise spans across Flutter, React Native, and various cloud technologies. I have a proven track record 
                of delivering high-quality applications for clients ranging from startups to enterprise companies like PETRONAS 
                and GIC Singapore. I'm passionate about clean code, problem-solving, and staying updated with the latest technological trends.
              </p>
            </div>

            {/* Key Highlights */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-semibold text-white mb-2">Mobile Specialist</h3>
                <p className="text-slate-400">Expert in Flutter and React Native with 4+ years of hands-on experience</p>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="text-4xl mb-4">☁️</div>
                <h3 className="text-xl font-semibold text-white mb-2">Cloud Expert</h3>
                <p className="text-slate-400">Experienced with AWS, Azure, and Firebase for scalable solutions</p>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-white mb-2">Certified Professional</h3>
                <p className="text-slate-400">Microsoft Azure certified and Android Kotlin developer</p>
              </div>
            </div>

            {/* Education */}
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Education</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">Bachelor of Software Engineering</h4>
                  <p className="text-emerald-400">FPT University</p>
                  <p className="text-slate-400">Sept 2015 - 2019</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Skills Section */}
        {activeTab === 'skills' && (
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Technical Skills</h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                My expertise spans across mobile development, backend technologies, cloud platforms, and databases.
              </p>
            </div>

            {/* Mobile Development */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📱</span>
                Mobile Development
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.mobile.map((skill) => (
                  <SkillBar key={skill.name} skill={skill} />
                ))}
              </div>
            </div>

            {/* Backend Development */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">⚙️</span>
                Backend Development
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.backend.map((skill) => (
                  <SkillBar key={skill.name} skill={skill} />
                ))}
              </div>
            </div>

            {/* Cloud & DevOps */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">☁️</span>
                Cloud & DevOps
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.cloud.map((skill) => (
                  <SkillBar key={skill.name} skill={skill} />
                ))}
              </div>
            </div>

            {/* Database */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">🗄️</span>
                Database
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.database.map((skill) => (
                  <SkillBar key={skill.name} skill={skill} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects Section */}
        {activeTab === 'projects' && (
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Featured Projects</h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-6">
                A comprehensive showcase of my work across various industries and technologies - from enterprise solutions to mobile applications.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <span className="px-4 py-2 bg-emerald-600/20 text-emerald-300 rounded-lg text-sm font-medium">
                  {projects.length} Total Projects
                </span>
                <span className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg text-sm font-medium">
                  {projects.filter(p => p.status === 'Live').length} Live Applications
                </span>
                <span className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-lg text-sm font-medium">
                  {new Set(projects.map(p => p.category)).size} Industry Domains
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>

            {/* Projects Summary */}
            <div className="mt-16 p-8 glass-card rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Project Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from(new Set(projects.map(p => p.category))).map((category) => {
                  const categoryProjects = projects.filter(p => p.category === category);
                  const categoryIcons: {[key: string]: string} = {
                    'Insurance': '🛡️',
                    'Agriculture': '🌾',
                    'Enterprise': '🏢',
                    'Oil & Gas': '⛽',
                    'IoT': '📡',
                    'Fintech': '💰',
                    'Logistics': '📦',
                    'Social': '👥',
                    'Healthcare': '🏥',
                    'Manufacturing': '🏭',
                    'Security': '🔐',
                    'Academic': '🎓'
                  };
                  
                  return (
                    <div key={category} className="text-center p-4 bg-slate-700/30 rounded-lg">
                      <div className="text-2xl mb-2">{categoryIcons[category]}</div>
                      <div className="text-white font-medium text-sm">{category}</div>
                      <div className="text-emerald-400 text-xs">{categoryProjects.length} project{categoryProjects.length > 1 ? 's' : ''}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Products Section */}
        {activeTab === 'products' && (
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Published Products</h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-6">
                Mobile applications and products that I've developed and published to app stores.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <span className="px-4 py-2 bg-emerald-600/20 text-emerald-300 rounded-lg text-sm font-medium">
                  {products.length} Published App{products.length > 1 ? 's' : ''}
                </span>
                <span className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg text-sm font-medium">
                  Android Platform
                </span>
                <span className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-lg text-sm font-medium">
                  Available on Play Store
                </span>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid gap-12">
              {products.map((product) => (
                <div key={product.id} className="glass-card rounded-2xl overflow-hidden">
                  {/* Product Header */}
                  <div className={`bg-gradient-to-r ${product.color} p-4 sm:p-6 lg:p-8 text-white`}>
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl backdrop-blur-sm flex-shrink-0">
                          {product.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{product.name}</h3>
                          <p className="text-lg sm:text-xl opacity-90 mb-2 sm:mb-3">{product.tagline}</p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                            <span className="px-2 sm:px-3 py-1 bg-white/20 rounded-full">
                              📱 {product.platform}
                            </span>
                            <span className="px-2 sm:px-3 py-1 bg-white/20 rounded-full">
                              📂 {product.category}
                            </span>
                            <span className="px-2 sm:px-3 py-1 bg-white/20 rounded-full">
                              ✅ {product.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right w-full sm:w-auto">
                        <div className="flex items-center justify-end gap-2 mb-1 sm:mb-2">
                          <span className="text-yellow-300">⭐</span>
                          <span className="font-bold">{product.rating}</span>
                        </div>
                        <div className="text-sm opacity-90">{product.downloadCount} downloads</div>
                      </div>
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                      {/* Left Column - Details */}
                      <div className="space-y-6">
                        {/* Description */}
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-3">About the App</h4>
                          <p className="text-slate-300 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Key Features */}
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-3">Key Features</h4>
                          <div className="grid grid-cols-1 gap-3">
                            {product.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                                <span className="text-slate-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Technologies */}
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-3">Built With</h4>
                          <div className="flex flex-wrap gap-2">
                            {product.technologies.map((tech) => (
                              <span key={tech} className="px-3 py-1 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-sm font-medium">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column - App Info & Actions */}
                      <div className="space-y-6">
                        {/* Download Button */}
                        <div className="bg-slate-700/30 rounded-xl p-6 text-center">
                          <h4 className="text-xl font-semibold text-white mb-4">Get the App</h4>
                          <a
                            href={product.storeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl font-semibold text-white hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/25"
                          >
                            <span className="text-2xl">📱</span>
                            <div className="text-left">
                              <div className="text-sm opacity-90">Get it on</div>
                              <div className="font-bold">Google Play</div>
                            </div>
                          </a>
                        </div>

                        {/* App Statistics */}
                        <div className="bg-slate-700/30 rounded-xl p-6">
                          <h4 className="text-xl font-semibold text-white mb-4">App Information</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Version</span>
                              <span className="text-white">{product.version}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Size</span>
                              <span className="text-white">{product.size}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Requires</span>
                              <span className="text-white">{product.targetSdk}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Updated</span>
                              <span className="text-white">{product.lastUpdated}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Downloads</span>
                              <span className="text-emerald-400 font-medium">{product.downloadCount}</span>
                            </div>
                          </div>
                        </div>

                        {/* App Highlights */}
                        <div className="bg-slate-700/30 rounded-xl p-6">
                          <h4 className="text-xl font-semibold text-white mb-4">Highlights</h4>
                          <div className="space-y-2">
                            {product.highlights.map((highlight, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <span className="text-emerald-400 mt-1">🌟</span>
                                <span className="text-slate-300 text-sm">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Package ID */}
                    <div className="mt-8 pt-6 border-t border-slate-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-slate-400 text-sm">Package ID:</span>
                          <code className="ml-2 text-emerald-400 bg-slate-700/50 px-2 py-1 rounded text-sm">
                            {product.packageId}
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-sm">Status:</span>
                          <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                            ✅ Live on Play Store
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coming Soon Section */}
            <div className="mt-16 text-center">
              <div className="glass-card p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-4">More Products Coming Soon</h3>
                <p className="text-slate-300 mb-6">
                  I'm constantly working on new mobile applications and products. Stay tuned for more releases!
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <span className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg text-sm">
                    🚀 iOS Version in Development
                  </span>
                  <span className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-lg text-sm">
                    🌐 Web Version Planned
                  </span>
                  <span className="px-4 py-2 bg-orange-600/20 text-orange-300 rounded-lg text-sm">
                    📱 More Apps in Pipeline
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {activeTab === 'experience' && (
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Work Experience</h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                My professional journey in software development.
              </p>
            </div>

            <div className="space-y-8">
              {experience.map((job, index) => (
                <div key={index} className="glass-card p-8 rounded-2xl">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🏢</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">{job.role}</h3>
                          <p className="text-emerald-400 font-medium">{job.company}</p>
                        </div>
                        <span className="text-slate-400 font-medium">{job.period}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Key Projects:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.projects.map((project) => (
                            <span key={project} className="px-3 py-1 bg-slate-700 text-emerald-400 text-sm rounded-lg">
                              {project}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {activeTab === 'certifications' && (
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Certifications & Awards</h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Professional certifications that validate my expertise.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {certifications.map((cert, index) => (
                <div key={index} className="glass-card p-8 rounded-2xl">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{cert.name}</h3>
                      <p className="text-emerald-400 font-medium mb-2">{cert.issuer}</p>
                      <p className="text-slate-400 mb-4">{cert.year}</p>
                      <a 
                        href={cert.credentialUrl}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                      >
                        🔗 View Credential
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Contact CTA Section */}

      {/* Project Detail Modal */}
      <ProjectDetailModal />

      <Footer />
    </div>
  );
}