'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Row, Col, Statistic, Button } from 'antd';
import { 
  FileTextOutlined,
  TagsOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useAllArticles } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import AdminLayout from '@/components/AdminLayout';
import AdminCard from '@/components/AdminCard';
import AdminDebugCard from '@/components/AdminDebugCard';
import Link from 'next/link';

export default function AdminDashboard() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const { data: articlesData, isLoading: articlesLoading, error: articlesError } = useAllArticles({ limit: 1000 });
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // Handle loading state
  if (articlesLoading) {
    return (
      <AdminLayout title="Dashboard" description="Overview of your blog">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-slate-400">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Handle error state
  if (articlesError) {
    console.error('Articles loading error:', articlesError);
  }

  // Safe data access with defaults - articlesData is already the array
  const articles = articlesData || [];
  const totalArticles = articles.length;
  const publishedArticles = articles.filter((a: any) => a.status === 'published').length;
  const totalViews = articles.reduce((sum: number, article: any) => sum + (article.view_count || 0), 0);

  return (
    <AdminLayout 
      title="Dashboard" 
      description="Overview of your blog content and statistics"
    >
      {/* Debug Information */}
      <AdminDebugCard />

      {/* Quick Stats */}
      <Row gutter={[24, 24]} className="mb-8 mt-8">
        <Col xs={24} sm={12} lg={6}>
          <Card className="glass-card border-white/10 bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300">
            <Statistic
              title={<span className="text-slate-300 font-medium">Total Articles</span>}
              value={totalArticles}
              prefix={<FileTextOutlined className="text-emerald-400" />}
              valueStyle={{ color: '#10b981', fontSize: '2rem', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="glass-card border-white/10 bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300">
            <Statistic
              title={<span className="text-slate-300 font-medium">Published</span>}
              value={publishedArticles}
              prefix={<EyeOutlined className="text-blue-400" />}
              valueStyle={{ color: '#3b82f6', fontSize: '2rem', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="glass-card border-white/10 bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300">
            <Statistic
              title={<span className="text-slate-300 font-medium">Categories</span>}
              value={categories.length}
              prefix={<TagsOutlined className="text-purple-400" />}
              valueStyle={{ color: '#a855f7', fontSize: '2rem', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="glass-card border-white/10 bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300">
            <Statistic
              title={<span className="text-slate-300 font-medium">Total Views</span>}
              value={totalViews}
              prefix={<EyeOutlined className="text-pink-400" />}
              valueStyle={{ color: '#ec4899', fontSize: '2rem', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <AdminCard title="Quick Actions" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create New Article */}
          <Link href="/admin/articles/new" className="block group">
            <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 p-6 transition-all duration-300 hover:border-emerald-500/40 hover:from-emerald-500/20 hover:to-emerald-600/30 hover:shadow-lg hover:shadow-emerald-500/10">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 transition-all duration-300 group-hover:bg-emerald-500/30">
                  <PlusOutlined className="text-xl text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Create New Article</h3>
                  <p className="text-sm text-emerald-300/80">Start writing</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Manage Articles */}
          <Link href="/admin/articles" className="block group">
            <div className="relative overflow-hidden rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/20 p-6 transition-all duration-300 hover:border-blue-500/40 hover:from-blue-500/20 hover:to-blue-600/30 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 transition-all duration-300 group-hover:bg-blue-500/30">
                  <EditOutlined className="text-xl text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Manage Articles</h3>
                  <p className="text-sm text-blue-300/80">Edit & organize</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Manage Categories */}
          <Link href="/admin/categories" className="block group">
            <div className="relative overflow-hidden rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/20 p-6 transition-all duration-300 hover:border-purple-500/40 hover:from-purple-500/20 hover:to-purple-600/30 hover:shadow-lg hover:shadow-purple-500/10">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 transition-all duration-300 group-hover:bg-purple-500/30">
                  <TagsOutlined className="text-xl text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Manage Categories</h3>
                  <p className="text-sm text-purple-300/80">Organize content</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </AdminCard>

      {/* Recent Activity */}
      {/* <AdminCard title="Recent Activity">
        <div className="text-center py-12 text-slate-400">
          <FileTextOutlined className="text-6xl mb-4 text-slate-600" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No recent activity</h3>
          <p className="text-slate-500 mb-6">
            Start by creating your first article or managing your content!
          </p>
          <Link href="/admin/articles/new">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="large"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderColor: 'transparent',
                color: 'white'
              }}
            >
              Create Your First Article
            </Button>
          </Link>
        </div>
      </AdminCard> */}
    </AdminLayout>
  );
}
