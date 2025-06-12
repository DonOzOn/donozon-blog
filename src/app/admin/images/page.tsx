'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Table, 
  Button, 
  Space, 
  message, 
  Modal, 
  Tag, 
  Typography, 
  Image,
  Statistic,
  Row,
  Col,
  Tooltip,
  Popconfirm,
  Empty
} from 'antd';
import { 
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileImageOutlined,
  ClearOutlined,
  RestoreOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import AdminCard from '@/components/AdminCard';
import { imageManagementService, type ArticleImage } from '@/services/image-management.service';

const { Text, Title } = Typography;
const { confirm } = Modal;

export default function ImageManagementPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [allImages, setAllImages] = useState<ArticleImage[]>([]);
  const [unusedImages, setUnusedImages] = useState<ArticleImage[]>([]);
  const [pendingDeletionImages, setPendingDeletionImages] = useState<ArticleImage[]>([]);
  const [globalStats, setGlobalStats] = useState<any>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'all' | 'unused' | 'pending'>('all');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [all, unused, pending, stats] = await Promise.all([
        imageManagementService.getAllImages(),
        imageManagementService.getUnusedImages(),
        imageManagementService.getImagesMarkedForDeletion(),
        imageManagementService.getGlobalImageStats(),
      ]);

      setAllImages(all);
      setUnusedImages(unused);
      setPendingDeletionImages(pending);
      setGlobalStats(stats);
    } catch (error) {
      console.error('Failed to load image data:', error);
      
      // Check if it's a migration issue
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        message.error('Image management not set up. Please run the database migration.');
      } else {
        message.error('Failed to load image management data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select images to delete');
      return;
    }

    confirm({
      title: `Delete ${selectedRowKeys.length} images?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone. The images will be permanently deleted from ImageKit.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setLoading(true);
          const result = await imageManagementService.forceDeleteImages(selectedRowKeys);
          
          if (result.failed.length > 0) {
            message.warning(`Deleted ${result.deleted} images, failed to delete ${result.failed.length} images`);
          } else {
            message.success(`Successfully deleted ${result.deleted} images`);
          }
          
          setSelectedRowKeys([]);
          await loadData();
        } catch (error) {
          console.error('Failed to delete images:', error);
          message.error('Failed to delete images');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleRunCleanup = async () => {
    confirm({
      title: 'Run Image Cleanup Job?',
      icon: <ClearOutlined />,
      content: 'This will permanently delete all images that have been marked for deletion and passed their grace period.',
      okText: 'Run Cleanup',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setCleanupLoading(true);
          const result = await imageManagementService.runCleanupJob();
          
          if (result.deleted_count > 0) {
            message.success(`Cleanup completed: ${result.deleted_count} images deleted`);
          } else {
            message.info('No images were eligible for cleanup');
          }
          
          await loadData();
        } catch (error) {
          console.error('Failed to run cleanup:', error);
          message.error('Failed to run image cleanup');
        } finally {
          setCleanupLoading(false);
        }
      },
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysUntilDeletion = (markedDate: string) => {
    const marked = new Date(markedDate);
    const now = new Date();
    const diffTime = marked.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imagekit_url',
      key: 'image',
      width: 80,
      render: (url: string, record: ArticleImage) => (
        <Image
          src={url}
          alt={record.file_name}
          width={60}
          height={40}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="/placeholder-image.png"
        />
      ),
    },
    {
      title: 'File Name',
      dataIndex: 'file_name',
      key: 'file_name',
      render: (name: string) => (
        <Text code style={{ fontSize: '12px' }}>
          {name.length > 30 ? `${name.substring(0, 30)}...` : name}
        </Text>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'file_size',
      key: 'file_size',
      width: 80,
      render: (size: number) => (
        <Text type="secondary">{formatFileSize(size || 0)}</Text>
      ),
    },
    {
      title: 'Article',
      key: 'article',
      render: (record: any) => {
        if (record.articles?.title) {
          return (
            <div>
              <Text strong>{record.articles.title}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                /{record.articles.slug}
              </Text>
            </div>
          );
        }
        return <Text type="secondary">No article</Text>;
      },
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (record: ArticleImage) => {
        if (record.marked_for_deletion_at) {
          const daysLeft = getDaysUntilDeletion(record.marked_for_deletion_at);
          return (
            <Tag color="orange">
              Deletion in {daysLeft}d
            </Tag>
          );
        }
        return record.is_used ? (
          <Tag color="green">Used</Tag>
        ) : (
          <Tag color="red">Unused</Tag>
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date: string) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {formatDate(date)}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (record: ArticleImage) => (
        <Space size="small">
          <Tooltip title="View Image">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => window.open(record.imagekit_url, '_blank')}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this image?"
            description="This action cannot be undone."
            onConfirm={async () => {
              try {
                await imageManagementService.forceDeleteImages([record.id]);
                message.success('Image deleted successfully');
                await loadData();
              } catch (error) {
                message.error('Failed to delete image');
              }
            }}
            okText="Delete"
            okType="danger"
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys as string[]);
    },
  };

  if (isLoading) {
    return (
      <AdminLayout title="Image Management" description="Manage article images and cleanup unused files">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-slate-400">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const displayImages = [...unusedImages, ...pendingDeletionImages];

  return (
    <AdminLayout 
      title={
        <div className="flex items-center gap-3">
          <FileImageOutlined className="text-blue-400" />
          Image Management
        </div>
      } 
      description="Manage article images and cleanup unused files"
    >
      {/* Statistics */}
      <AdminCard title="Image Statistics" className="mb-6">
        <Row gutter={16}>
          <Col xs={12} sm={6}>
            <Statistic
              title="Total Images"
              value={globalStats.total_images || 0}
              valueStyle={{ color: '#3b82f6' }}
              prefix={<FileImageOutlined />}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="Used Images"
              value={globalStats.used_images || 0}
              valueStyle={{ color: '#10b981' }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="Unused Images"
              value={globalStats.unused_images || 0}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="Total Size"
              value={formatFileSize(globalStats.total_size || 0)}
              valueStyle={{ color: '#8b5cf6' }}
            />
          </Col>
        </Row>
      </AdminCard>

      {/* Actions */}
      <AdminCard className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              type="primary"
              icon={<ClearOutlined />}
              onClick={handleRunCleanup}
              loading={cleanupLoading}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderColor: 'transparent'
              }}
            >
              Run Cleanup Job
            </Button>
            
            <Button
              icon={<BarChartOutlined />}
              onClick={loadData}
              loading={loading}
            >
              Refresh Data
            </Button>
          </div>

          {selectedRowKeys.length > 0 && (
            <div className="flex items-center gap-3">
              <Text type="secondary">
                {selectedRowKeys.length} selected
              </Text>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteSelected}
                disabled={loading}
              >
                Delete Selected
              </Button>
            </div>
          )}
        </div>
      </AdminCard>

      {/* Images Table */}
      <AdminCard title={`Image Management (${displayImages.length} images)`}>
        {displayImages.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-slate-400">
                No unused or pending deletion images found
              </span>
            }
          />
        ) : (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={displayImages}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} images`,
            }}
            scroll={{ x: 800 }}
          />
        )}
      </AdminCard>

      <style jsx global>{`
        .ant-statistic-title {
          color: #cbd5e1 !important;
        }
        
        .ant-table-thead > tr > th {
          background-color: rgba(51, 65, 85, 0.5) !important;
          border-bottom: 1px solid #475569 !important;
          color: #cbd5e1 !important;
        }
        
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid rgba(71, 85, 105, 0.3) !important;
        }
        
        .ant-table-tbody > tr:hover > td {
          background-color: rgba(51, 65, 85, 0.3) !important;
        }
        
        .ant-empty-description {
          color: #94a3b8 !important;
        }
      `}</style>
    </AdminLayout>
  );
}
