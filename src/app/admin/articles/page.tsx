/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Table, 
  Button, 
  Space, 
  Popconfirm, 
  Tag, 
  message,
  Input,
  Select} from 'antd';
import { 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useAllArticles, useDeleteArticle } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import AdminLayout from '@/components/AdminLayout';
import AdminCard from '@/components/AdminCard';
import Link from 'next/link';
import type { ColumnsType } from 'antd/es/table';

export default function ArticlesManagePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const { data: articlesData, isLoading, error, refetch } = useAllArticles({ limit: 100 });
  const { data: categories = [] } = useCategories();
  const deleteArticleMutation = useDeleteArticle();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  // Debug logging
  useEffect(() => {
    console.log('📊 Articles Management Debug:');
    console.log('  isLoading:', isLoading);
    console.log('  error:', error);
    console.log('  articlesData:', articlesData);
    console.log('  articles array:', articlesData);
    console.log('  articles length:', articlesData?.length);
  }, [isLoading, error, articlesData]);

  if (!isAuthenticated) {
    return null;
  }

  // Handle loading state
  if (isLoading) {
    return (
      <AdminLayout title="Manage Articles" description="Create, edit, and organize your blog posts">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-slate-400">Loading articles...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Handle error state
  if (error) {
    return (
      <AdminLayout title="Manage Articles" description="Create, edit, and organize your blog posts">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2 text-white">Error Loading Articles</h2>
            <p className="text-slate-400 mb-4">
              {error?.message || 'Failed to load articles'}
            </p>
            <Button 
              onClick={() => refetch()} 
              type="primary"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderColor: 'transparent'
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteArticleMutation.mutateAsync(id);
      message.success('Article deleted successfully');
      refetch();
    } catch  {
      message.error('Failed to delete article');
    }
  };

  // Filter articles based on search and category - articlesData is already the array
  const articles = articlesData || [];
  const filteredArticles = articles.filter((article: any) => {
    const matchesSearch = !searchText || 
      article.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesCategory = !selectedCategory || article.category_slug === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const columns: ColumnsType<any> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div>
          <div className="font-medium text-white">{title}</div>
          <div className="text-sm text-slate-400 truncate max-w-xs">
            {record.excerpt}
          </div>
        </div>
      ),
    },
    {
      title: 'Author',
      dataIndex: 'author_name',
      key: 'author',
      width: 120,
      render: (author) => (
        <span className="text-slate-300">{author || 'Unknown'}</span>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category_name',
      key: 'category',
      width: 120,
      render: (category) => (
        <Tag 
          color="blue" 
          className="bg-blue-500/20 border-blue-400 text-blue-300"
        >
          {category || 'Uncategorized'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag 
          color={status === 'published' ? 'green' : 'orange'} 
          className={status === 'published' 
            ? 'bg-green-500/20 border-green-400 text-green-300' 
            : 'bg-orange-500/20 border-orange-400 text-orange-300'
          }
        >
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Featured',
      dataIndex: 'is_featured',
      key: 'featured',
      width: 80,
      render: (featured) => (
        <Tag 
          color={featured ? 'gold' : 'default'} 
          className={featured 
            ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300' 
            : 'bg-slate-500/20 border-slate-400 text-slate-300'
          }
        >
          {featured ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Views',
      dataIndex: 'view_count',
      key: 'views',
      width: 80,
      render: (views) => (
        <span className="text-slate-300">{views || 0}</span>
      ),
    },
    {
      title: 'Published',
      dataIndex: 'published_at',
      key: 'published',
      width: 120,
      render: (date) => (
        <span className="text-slate-300">
          {date ? new Date(date).toLocaleDateString() : 'Not published'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => window.open(`/articles/${record.slug}`, '_blank')}
            title="View"
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => router.push(`/admin/articles/edit/${record.id}`)}
            title="Edit"
            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
          />
          <Popconfirm
            title="Delete Article"
            description="Are you sure you want to delete this article?"
            onConfirm={() => handleDelete(record.id!)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Delete"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout 
      title="Manage Articles" 
      description="Create, edit, and organize your blog posts"
    >
      <AdminCard>
        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-auto">
              <Input
                placeholder="Search articles..."
                allowClear
                prefix={<SearchOutlined className="text-slate-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full sm:w-[300px]"
                style={{
                  backgroundColor: 'rgba(51, 65, 85, 0.5)',
                  borderColor: '#475569',
                  color: '#ffffff'
                }}
                styles={{
                  input: {
                    backgroundColor: 'transparent',
                    color: '#ffffff'
                  }
                }}
              />
            </div>
            <div className="w-full sm:w-auto">
              <Select
                placeholder="Filter by category"
                allowClear
                style={{ 
                  width: '100%', 
                  minWidth: 200,
                }}
                onChange={setSelectedCategory}
                className="custom-select"
                dropdownStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {categories.map((category: any) => (
                  <Select.Option key={category.slug} value={category.slug}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
          
          <Link href="/admin/articles/new" className="w-full sm:w-auto">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="large"
              className="w-full sm:w-auto"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderColor: 'transparent'
              }}
            >
              Add New Article
            </Button>
          </Link>
        </div>

        {/* Articles Table */}
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 text-slate-600">📝</div>
            <h3 className="text-lg font-medium text-white mb-2">No Articles Found</h3>
            <p className="text-slate-400 mb-6">
              {searchText || selectedCategory 
                ? 'No articles match your search criteria.' 
                : 'You haven\'t created any articles yet.'}
            </p>
            <Link href="/admin/articles/new">
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                size="large"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  borderColor: 'transparent'
                }}
              >
                Create Your First Article
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={filteredArticles}
              rowKey="id"
              loading={isLoading}
              pagination={{
                total: filteredArticles.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} articles`,
                className: 'custom-pagination'
              }}
              scroll={{ x: 800 }}
              className="custom-table"
            />
          </div>
        )}
      </AdminCard>

      <style jsx global>{`
        .custom-table .ant-table {
          background-color: transparent !important;
        }
        
        .custom-table .ant-table-thead > tr > th {
          background-color: rgba(51, 65, 85, 0.5) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #cbd5e1 !important;
          font-weight: 600 !important;
        }
        
        .custom-table .ant-table-tbody > tr > td {
          background-color: transparent !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
        
        .custom-table .ant-table-tbody > tr:hover > td {
          background-color: rgba(255, 255, 255, 0.03) !important;
        }
        
        .custom-select .ant-select-selector {
          background-color: rgba(51, 65, 85, 0.5) !important;
          border-color: #475569 !important;
          color: #ffffff !important;
        }
        
        .custom-select .ant-select-selection-placeholder {
          color: #94a3b8 !important;
        }
        
        .custom-pagination .ant-pagination-item {
          background-color: rgba(51, 65, 85, 0.5) !important;
          border-color: #475569 !important;
        }
        
        .custom-pagination .ant-pagination-item a {
          color: #cbd5e1 !important;
        }
        
        .custom-pagination .ant-pagination-item-active {
          background-color: #3b82f6 !important;
          border-color: #3b82f6 !important;
        }
        
        .custom-pagination .ant-pagination-item-active a {
          color: #ffffff !important;
        }
      `}</style>
    </AdminLayout>
  );
}
