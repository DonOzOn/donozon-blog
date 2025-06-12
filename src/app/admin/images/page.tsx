'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Tag, 
  Space, 
  Popconfirm, 
  message, 
  Typography,
  Statistic,
  Row,
  Col,
  Select,
  Input,
  Image,
  Tooltip,
  Modal,
  Switch,
  Alert
} from 'antd';
import { 
  DeleteOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  FileImageOutlined,
  CloudDownloadOutlined,
  RestOutlined,
  PlayCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import AdminLayout from '@/components/AdminLayout';
import AdminCard from '@/components/AdminCard';
import { imageManagementService, type ArticleImage } from '@/services/image-management.service';
import { formatDistanceToNow } from 'date-fns';

const { Title, Text } = Typography;
const { Search } = Input;

interface ImageStats {
  total_images: number;
  used_images: number;
  unused_images: number;
  pending_deletion: number;
  total_size: number;
  total_articles_with_images: number;
}

export default function AdminImagesPage() {
  const [images, setImages] = useState<ArticleImage[]>([]);
  const [stats, setStats] = useState<ImageStats>({
    total_images: 0,
    used_images: 0,
    unused_images: 0,
    pending_deletion: 0,
    total_size: 0,
    total_articles_with_images: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'used' | 'unused' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [autoCleanup, setAutoCleanup] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allImages, globalStats] = await Promise.all([
        imageManagementService.getAllImages(),
        imageManagementService.getGlobalImageStats(),
      ]);
      
      setImages(allImages);
      setStats(globalStats);
    } catch (error) {
      console.error('Failed to load image data:', error);
      message.error('Failed to load image data');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select images to delete');
      return;
    }

    try {
      const result = await imageManagementService.forceDeleteImages(selectedRowKeys);
      
      if (result.failed.length > 0) {
        message.warning(`Deleted ${result.deleted} images, failed to delete ${result.failed.length} images`);
      } else {
        message.success(`Successfully deleted ${result.deleted} images`);
      }
      
      setSelectedRowKeys([]);
      await loadData();
    } catch (error) {
      console.error('Bulk delete failed:', error);
      message.error('Failed to delete images');
    }
  };

  const handleCleanupJob = async () => {
    setCleanupLoading(true);
    try {
      const result = await imageManagementService.runCleanupJob();
      
      if (result.deleted_count > 0) {
        message.success(`Cleanup completed: ${result.deleted_count} images deleted`);
        await loadData();
      } else {
        message.info('No images needed cleanup');
      }
    } catch (error) {
      console.error('Cleanup job failed:', error);
      message.error('Cleanup job failed');
    } finally {
      setCleanupLoading(false);
    }
  };

  const filteredImages = images.filter(image => {
    // Filter by type
    let typeMatch = true;
    switch (filterType) {
      case 'used':
        typeMatch = image.is_used;
        break;
      case 'unused':
        typeMatch = !image.is_used;
        break;
      case 'pending':
        typeMatch = !!image.marked_for_deletion_at;
        break;
    }

    // Filter by search term
    const searchMatch = !searchTerm || 
      image.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.imagekit_url.toLowerCase().includes(searchTerm.toLowerCase());

    return typeMatch && searchMatch;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const columns = [
    {
      title: 'Preview',
      dataIndex: 'imagekit_url',
      key: 'preview',
      width: 80,
      render: (url: string) => (
        <Image
          src={url}
          alt="Preview"
          width={50}
          height={50}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          preview={{
            src: url,
            onVisibleChange: (visible) => {
              if (!visible) setPreviewImage(null);
            }
          }}
        />
      ),
    },
    {
      title: 'File Name',
      dataIndex: 'file_name',
      key: 'file_name',
      ellipsis: true,
      render: (name: string, record: ArticleImage) => (
        <div>
          <div className="font-medium text-white">{name}</div>
          <div className="text-xs text-slate-400">
            {formatFileSize(record.file_size || 0)} • {record.mime_type}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_used',
      key: 'status',
      width: 120,
      render: (isUsed: boolean, record: ArticleImage) => (
        <Space direction="vertical" size="small">
          <Tag color={isUsed ? 'green' : 'orange'}>
            {isUsed ? 'Used' : 'Unused'}
          </Tag>
          {record.is_featured_image && (
            <Tag color="blue">Featured</Tag>
          )}
          {record.marked_for_deletion_at && (
            <Tag color="red">Pending Deletion</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Article',
      dataIndex: 'article_id',
      key: 'article',
      render: (articleId: string, record: any) => {
        if (!articleId) {
          return <Text className="text-slate-400">Orphaned</Text>;
        }
        
        const article = record.articles;
        if (article) {
          return (
            <div>
              <div className="text-white">{article.title}</div>
              <div className="text-xs text-slate-400">/{article.slug}</div>
            </div>
          );
        }
        
        return <Text className="text-slate-400">Article ID: {articleId}</Text>;
      },
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date: string) => (
        <Tooltip title={new Date(date).toLocaleString()}>
          <Text className="text-slate-400">
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (record: ArticleImage) => (
        <Space>
          <Tooltip title="View Full Size">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => setPreviewImage(record.imagekit_url)}
              className="text-slate-400 hover:text-white"
            />
          </Tooltip>
          <Popconfirm
            title="Delete Image"
            description="Are you sure you want to delete this image? This action cannot be undone."
            onConfirm={() => handleBulkDelete()}
            okText="Delete"
            okType="danger"
            cancelText="Cancel"
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              className="text-red-400 hover:text-red-300"
              onClick={() => setSelectedRowKeys([record.id])}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout title="Image Management" description="Manage and optimize your blog images">
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <AdminCard>
            <Statistic
              title={<span className="text-slate-300">Total Images</span>}
              value={stats.total_images}
              prefix={<FileImageOutlined className="text-blue-400" />}
              valueStyle={{ color: '#60a5fa' }}
            />
          </AdminCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AdminCard>
            <Statistic
              title={<span className="text-slate-300">Used Images</span>}
              value={stats.used_images}
              prefix={<span className="text-green-400">✓</span>}
              valueStyle={{ color: '#34d399' }}
            />
          </AdminCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AdminCard>
            <Statistic
              title={<span className="text-slate-300">Unused Images</span>}
              value={stats.unused_images}
              prefix={<span className="text-orange-400">⚠</span>}
              valueStyle={{ color: '#fb923c' }}
            />
          </AdminCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AdminCard>
            <Statistic
              title={<span className="text-slate-300">Total Size</span>}
              value={formatFileSize(stats.total_size)}
              prefix={<CloudDownloadOutlined className="text-purple-400" />}
              valueStyle={{ color: '#a78bfa' }}
            />
          </AdminCard>
        </Col>
      </Row>

      {/* Actions and Auto-Cleanup */}
      <AdminCard className="mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} lg={12}>
            <Space wrap>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={handleCleanupJob}
                loading={cleanupLoading}
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  borderColor: 'transparent'
                }}
              >
                Run Cleanup Job
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadData}
                loading={loading}
                style={{
                  backgroundColor: 'rgba(51, 65, 85, 0.5)',
                  borderColor: '#475569',
                  color: '#cbd5e1'
                }}
              >
                Refresh
              </Button>
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title="Bulk Delete"
                  description={`Delete ${selectedRowKeys.length} selected images?`}
                  onConfirm={handleBulkDelete}
                  okText="Delete"
                  okType="danger"
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                  >
                    Delete Selected ({selectedRowKeys.length})
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </Col>
          <Col xs={24} lg={12}>
            <div className="flex items-center justify-end space-x-4">
              <div className="flex items-center space-x-2">
                <Text className="text-slate-300">Auto-cleanup:</Text>
                <Switch
                  checked={autoCleanup}
                  onChange={setAutoCleanup}
                  size="small"
                />
              </div>
            </div>
          </Col>
        </Row>
        
        {stats.unused_images > 0 && (
          <Alert
            className="mt-4"
            message="Unused Images Detected"
            description={`You have ${stats.unused_images} unused images taking up ${formatFileSize(
              images.filter(img => !img.is_used).reduce((sum, img) => sum + (img.file_size || 0), 0)
            )} of storage. Consider running a cleanup job.`}
            type="warning"
            showIcon
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderColor: 'rgba(245, 158, 11, 0.3)',
              color: '#fbbf24'
            }}
          />
        )}
      </AdminCard>

      {/* Filters and Search */}
      <AdminCard className="mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={8}>
            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: '100%' }}
              options={[
                { label: 'All Images', value: 'all' },
                { label: 'Used Images', value: 'used' },
                { label: 'Unused Images', value: 'unused' },
                { label: 'Pending Deletion', value: 'pending' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} lg={16}>
            <Search
              placeholder="Search by filename or URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      </AdminCard>

      {/* Images Table */}
      <AdminCard>
        <Table
          columns={columns}
          dataSource={filteredImages}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} images`,
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            getCheckboxProps: (record) => ({
              disabled: record.is_used && !record.marked_for_deletion_at,
            }),
          }}
          scroll={{ x: 800 }}
          className="image-management-table"
        />
      </AdminCard>

      {/* Image Preview Modal */}
      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        width="80%"
        style={{ maxWidth: 1000 }}
        centered
      >
        {previewImage && (
          <div className="text-center">
            <Image
              src={previewImage}
              alt="Full size preview"
              style={{ maxWidth: '100%', maxHeight: '70vh' }}
            />
            <div className="mt-4 text-slate-400">
              <Text copyable={{ text: previewImage }}>
                {previewImage}
              </Text>
            </div>
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .image-management-table .ant-table {
          background: rgba(30, 41, 59, 0.5) !important;
          border: 1px solid rgba(71, 85, 105, 0.3) !important;
        }

        .image-management-table .ant-table-thead > tr > th {
          background: rgba(51, 65, 85, 0.8) !important;
          border-color: rgba(71, 85, 105, 0.3) !important;
          color: #cbd5e1 !important;
        }

        .image-management-table .ant-table-tbody > tr > td {
          border-color: rgba(71, 85, 105, 0.2) !important;
          background: transparent !important;
        }

        .image-management-table .ant-table-tbody > tr:hover > td {
          background: rgba(51, 65, 85, 0.3) !important;
        }

        .ant-select-selector {
          background-color: rgba(51, 65, 85, 0.5) !important;
          border-color: #475569 !important;
          color: #ffffff !important;
        }

        .ant-input {
          background-color: rgba(51, 65, 85, 0.5) !important;
          border-color: #475569 !important;
          color: #ffffff !important;
        }

        .ant-input::placeholder {
          color: #94a3b8 !important;
        }
      `}</style>
    </AdminLayout>
  );
}
