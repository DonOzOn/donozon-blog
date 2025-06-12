/**
 * Admin Sidebar Component
 * Standardized sidebar for all admin pages
 */

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Avatar, Dropdown } from 'antd';
import { 
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

interface AdminSidebarProps {
  onLogout: () => void;
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();

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
      onClick: onLogout,
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
      children: [
        { key: 'categories-list', label: 'Manage Categories', href: '/admin/categories' },
      ]
    },
    {
      key: 'tags',
      icon: <TagOutlined className="text-lg" />,
      label: 'Tags',
      href: '/admin/tags',
      active: pathname.startsWith('/admin/tags'),
      children: [
        { key: 'tags-list', label: 'Manage Tags', href: '/admin/tags' },
      ]
    },
    {
      key: 'images',
      icon: <FileImageOutlined className="text-lg" />,
      label: 'Image Management',
      href: '/admin/images',
      active: pathname.startsWith('/admin/images'),
    },
  ];

  return (
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
    </aside>
  );
}
