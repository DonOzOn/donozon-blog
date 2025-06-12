'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button, Drawer, Avatar, Dropdown } from 'antd';
import { 
  MenuOutlined,
  DashboardOutlined,
  FileTextOutlined,
  TagsOutlined,
  TagOutlined,
  UserOutlined,
  LogoutOutlined,
  PlusOutlined,
  EyeOutlined,
  FileImageOutlined
} from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import '@/styles/admin.css';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function AdminLayout({ children, title = 'Admin Dashboard', description }: AdminLayoutProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin');
    }
    
    // Add admin theme class to body
    document.body.classList.add('admin-theme');
    
    return () => {
      document.body.classList.remove('admin-theme');
    };
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  const userMenuItems = [
    {
      key: 'user-info',
      label: (
        <div className="px-2 py-1 border-b border-white/10">
          <div className="text-sm font-medium text-white">{user?.username}</div>
          <div className="text-xs text-slate-400">Administrator</div>
        </div>
      ),
      disabled: true,
    },
    {
      key: 'logout',
      label: (
        <span className="flex items-center gap-2 text-red-400 hover:text-red-300">
          <LogoutOutlined /> Logout
        </span>
      ),
      onClick: handleLogout,
    },
  ];

  const sidebarItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined className="text-lg" />,
      label: 'Dashboard',
      href: '/admin/dashboard',
      active: pathname === '/admin/dashboard'
    },
    {
      key: 'articles',
      icon: <FileTextOutlined className="text-lg" />,
      label: 'Articles',
      href: '/admin/articles',
      active: pathname.startsWith('/admin/articles'),
      children: [
        { key: 'articles-list', label: 'Manage Articles', href: '/admin/articles' },
        { key: 'articles-new', label: 'Add New Article', href: '/admin/articles/new' },
      ]
    },
    {
      key: 'categories',
      icon: <TagsOutlined className="text-lg" />,
      label: 'Categories',
      href: '/admin/categories',
      active: pathname.startsWith('/admin/categories'),
      // children: [
      //   { key: 'categories-list', label: 'Manage Categories', href: '/admin/categories' },
      //   // { key: 'categories-new', label: 'Add New Category', href: '/admin/categories/new' },
      // ]
    },
    {
      key: 'tags',
      icon: <TagOutlined className="text-lg" />,
      label: 'Tags',
      href: '/admin/tags',
      active: pathname.startsWith('/admin/tags'),
      // children: [
      //   { key: 'tags-list', label: 'Manage Tags', href: '/admin/tags' },
      // ]
    },
    {
      key: 'images',
      icon: <FileImageOutlined className="text-lg" />,
      label: 'Image Management',
      href: '/admin/images',
      active: pathname.startsWith('/admin/images'),
      // children: [
      //   { key: 'images-list', label: 'Manage Images', href: '/admin/images' },
      // ]
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-slate-800/50 backdrop-blur-sm border-r border-white/10 flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-baseline focus:outline-none group">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent leading-[1.26] group-hover:from-purple-400 group-hover:to-pink-500 transition-all duration-300">
              DonOzOn
            </span>
            <span className="text-sm font-bold text-cyan-400 leading-[1.26] ml-1">
              .admin
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <div key={item.key}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium group ${
                    item.active
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
                {item.children && item.active && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.key}
                        href={child.href}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                          pathname === child.href
                            ? 'text-blue-400 bg-blue-500/10'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                href="/admin/articles/new"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all duration-300"
              >
                <PlusOutlined />
                New Article
              </Link>
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-300"
              >
                <EyeOutlined />
                View Site
              </Link>
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="p-6 border-t border-white/10">
          <Dropdown 
            menu={{ items: userMenuItems }}
            placement="topRight"
            trigger={['click']}
            overlayClassName="admin-dropdown"
          >
            <div className="flex items-center space-x-3 cursor-pointer hover:bg-white/5 px-3 py-2 rounded-lg transition-all duration-300">
              <Avatar 
                icon={<UserOutlined />} 
                className="bg-gradient-to-r from-blue-500 to-purple-500" 
                size="small"
              />
              <div className="flex-1">
                <div className="font-medium text-white text-sm">{user?.username}</div>
                <div className="text-xs text-slate-400">Administrator</div>
              </div>
            </div>
          </Dropdown>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden w-full glass sticky top-0 z-50 border-b border-white/10">
          <div className="px-4 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link href="/" className="flex items-baseline focus:outline-none group">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  DonOzOn
                </span>
                <span className="text-sm font-bold text-cyan-400 ml-1">
                  .admin
                </span>
              </Link>

              {/* Mobile menu button */}
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
        </header>

        {/* Page Header */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border-b border-white/10">
          <div className="px-4 lg:px-6 py-6 lg:py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{title}</h1>
                {description && (
                  <p className="text-slate-400 text-sm lg:text-base">{description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 bg-slate-900">
          {children}
        </main>
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div className="flex items-baseline">
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">DonOzOn</span>
            <span className="text-sm font-bold text-cyan-400">.admin</span>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className="admin-mobile-drawer"
        zIndex={1000}
        styles={{
          wrapper: { zIndex: 1000 },
          mask: {
            backgroundColor: 'rgba(15, 15, 35, 0.8)',
            backdropFilter: 'blur(8px)'
          },
          content: {
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          },
          header: {
            backgroundColor: '#1e293b',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#f8fafc'
          },
          body: {
            backgroundColor: '#1e293b',
            color: '#f8fafc',
            padding: '0'
          }
        }}
      >
        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl mb-6">
            <Avatar 
              icon={<UserOutlined />} 
              className="bg-gradient-to-r from-blue-500 to-purple-500" 
            />
            <div>
              <div className="font-medium text-white">{user?.username}</div>
              <div className="text-xs text-slate-400">Administrator</div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            {sidebarItems.map((item) => (
              <div key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                    item.active
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
                {item.children && item.active && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.key}
                        href={child.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                          pathname === child.href
                            ? 'text-blue-400 bg-blue-500/10'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                href="/admin/articles/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all duration-300"
              >
                <PlusOutlined />
                New Article
              </Link>
              <Link
                href="/"
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-300"
              >
                <EyeOutlined />
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 w-full text-left"
              >
                <LogoutOutlined />
                Logout
              </button>
            </div>
          </div>
        </div>
      </Drawer>

      <style jsx global>{`
        .admin-dropdown .ant-dropdown {
          background-color: #1e293b !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
          border-radius: 12px !important;
        }
        
        .admin-dropdown .ant-dropdown-menu {
          background-color: #1e293b !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 8px !important;
        }
        
        .admin-dropdown .ant-dropdown-menu-item {
          color: #cbd5e1 !important;
          border-radius: 8px !important;
          margin-bottom: 4px !important;
          padding: 8px 12px !important;
        }
        
        .admin-dropdown .ant-dropdown-menu-item:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: #ffffff !important;
        }
        
        .admin-dropdown .ant-dropdown-menu-item:last-child {
          margin-bottom: 0 !important;
        }
      `}</style>
    </div>
  );
}
