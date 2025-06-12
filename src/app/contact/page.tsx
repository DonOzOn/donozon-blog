'use client';

import { useState, useEffect } from 'react';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { AppConfig } from '@/utils/AppConfig';
import { useContactForm } from '@/hooks/useContactForm';
import { initEmailJS } from '@/services/emailService';

export default function ContactPage() {
  const { submitForm, resetForm, isLoading, isSuccess, error } = useContactForm();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  // Initialize EmailJS on component mount
  useEffect(() => {
    initEmailJS();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      return;
    }

    const success = await submitForm(formData);
    
    if (success) {
      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
      });
    }
  };

  const handleNewMessage = () => {
    resetForm();
  };
  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden scroll-optimized">
      <Navbar />
      {/* Contact Section */}
      <section className="relative bg-slate-900 py-20">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-[1252px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 glass-card rounded-2xl hover:bg-white/5 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">Email</h3>
                    <p className="text-slate-300 mb-2">{AppConfig.email}</p>
                    <p className="text-slate-400 text-sm">I&apos;ll get back to you within 24 hours</p>
                  </div>
                </div>



                <div className="flex items-start gap-4 p-6 glass-card rounded-2xl hover:bg-white/5 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <div className="text-lg">🇻🇳</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">Location</h3>
                    <p className="text-slate-300 mb-2">Vietnam</p>
                    <p className="text-slate-400 text-sm">Available for remote collaboration</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {/* <div className="mt-12">
                <h3 className="text-xl font-semibold text-white mb-6">Follow Me</h3>
                <div className="flex gap-4">
                  {[
                    { name: 'LinkedIn', href: AppConfig.social.linkedin, color: 'from-blue-600 to-blue-500' },
                    { name: 'Medium', href: AppConfig.social.medium, color: 'from-green-600 to-green-500' },
                    { name: 'Instagram', href: AppConfig.social.instagram, color: 'from-purple-600 to-pink-500' },
                  ].map((social) => (
                    <a 
                      key={social.name}
                      href={social.href} 
                      className={`w-12 h-12 bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg`}
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div> */}
            </div>

            {/* Contact Form */}
            <div>
              <div className="glass-card rounded-2xl p-8 lg:p-10">
                <h2 className="text-3xl font-bold text-white mb-8">Send a Message</h2>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Success Message */}
                  {isSuccess && (
                    <div className="p-4 bg-emerald-900/50 border border-emerald-500 rounded-lg">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <p className="text-emerald-400 font-medium">Message sent successfully!</p>
                          <p className="text-emerald-300 text-sm">I&apos;ll get back to you within 24 hours.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleNewMessage}
                        className="mt-3 text-emerald-400 hover:text-emerald-300 text-sm underline"
                      >
                        Send another message
                      </button>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-400">{error}</p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="consultation">Consultation</option>
                      <option value="feedback">Feedback</option>
                      <option value="question">Question</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors resize-none"
                      placeholder="Tell me about your project or question..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Send Message
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>

                  <p className="text-sm text-slate-400 text-center">
                    I&apos;ll get back to you within 24 hours. Your information is kept private and secure.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}