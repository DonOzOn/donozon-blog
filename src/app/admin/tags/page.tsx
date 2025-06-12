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
  Modal,
  Form,
  ColorPicker,
  Statistic,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  TagOutlined
} from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useTags, 
  useCreateTag, 
  useUpdateTag, 
  useDeleteTag 
} from '@/hooks/useTags';
import AdminLayout from '@/components/AdminLayout';
import AdminCard from '@/components/AdminCard';
import type { ColumnsType } from 'antd/es/table';
import type { Tag as TagType, TagInsert } from '@/types/database';

const { TextArea } = Input;

export default function TagsManagePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [form] = Form.useForm();
  
  const { data: tags = [], isLoading, error, refetch } = useTags();
  const createTagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  // Debug logging
  useEffect(() => {
    console.log('📊 Tags Management Debug:');
    console.log('  isLoading:', isLoading);
    console.log('  error:', error);
    console.log('  tags:', tags);
    console.log('  tags length:', tags?.length);
  }, [isLoading, error, tags]);

  if (!isAuthenticated) {
    return null;
  }

  // Handle loading state
  if (isLoading) {
    return (
      <AdminLayout title="Manage Tags" description="Organize and manage your content tags">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-slate-400">Loading tags...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Handle error state
  if (error) {
    return (
      <AdminLayout title="Manage Tags" description="Organize and manage your content tags">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2 text-white">Error Loading Tags</h2>
            <p className="text-slate-400 mb-4">
              {error?.message || 'Failed to load tags'}
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
      await deleteTagMutation.mutateAsync(id);
      message.success('Tag deleted successfully');
      refetch();
    } catch (error) {
      message.error('Failed to delete tag');
    }
  };

  const handleEdit = (tag: TagType) => {
    setEditingTag(tag);
    form.setFieldsValue({
      name: tag.name,
      slug: tag.slug,
      description: tag.description,
      color: tag.color,
    });
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingTag(null);
    form.resetFields();
    form.setFieldsValue({
      color: '#3b82f6'
    });
    setIsModalVisible(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    form.setFieldsValue({ slug });
  };

  const handleSubmit = async (values: any) => {
    try {
      const tagData: TagInsert = {
        name: values.name,
        slug: values.slug,
        description: values.description || null,
        color: typeof values.color === 'string' ? values.color : values.color?.toHexString?.() || null,
        usage_count: editingTag?.usage_count || 0,
        created_at: new Date().toISOString(),
      };

      if (editingTag) {
        await updateTagMutation.mutateAsync({
          id: editingTag.id,
          data: tagData
        });
        message.success('Tag updated successfully');
      } else {
        await createTagMutation.mutateAsync(tagData);
        message.success('Tag created successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
      refetch();
    } catch (error) {
      console.error('Error saving tag:', error);
      message.error('Failed to save tag');
    }
  };

  // Filter tags based on search
  const filteredTags = tags.filter((tag: TagType) =>
    !searchText || 
    tag.name.toLowerCase().includes(searchText.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<TagType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="flex items-center space-x-3">
          {record.color && (
            <div 
              className="w-4 h-4 rounded-full border border-slate-400"
              style={{ backgroundColor: record.color }}
            />
          )}
          <div>
            <div className="font-medium text-white">{name}</div>
            <div className="text-sm text-slate-400">#{record.slug}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) => (
        <span className="text-slate-300">
          {description || 'No description'}
        </span>
      ),
    },
    {
      title: 'Usage Count',
      dataIndex: 'usage_count',
      key: 'usage_count',
      width: 120,
      render: (count) => (
        <Tag 
          color="blue"
          className="bg-blue-500/20 border-blue-400 text-blue-300"
        >
          {count || 0} articles
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created',
      width: 120,
      render: (date) => (
        <span className="text-slate-300">
          {date ? new Date(date).toLocaleDateString() : 'Unknown'}
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
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Edit"
            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
          />
          <Popconfirm
            title="Delete Tag"
            description="Are you sure you want to delete this tag?"
            onConfirm={() => handleDelete(record.id)}
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

  // Calculate stats
  const totalTags = tags.length;
  const mostUsed = tags.length > 0 ? Math.max(...tags.map(t => t.usage_count || 0)) : 0;
  const unusedTags = tags.filter(t => (t.usage_count || 0) === 0).length;

  return (
    <AdminLayout 
      title="Manage Tags" 
      description="Organize and manage your content tags"
    >
      {/* Quick Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <AdminCard className="text-center">
            <Statistic
              title={<span className="text-slate-300">Total Tags</span>}
              value={totalTags}
              prefix={<TagOutlined className="text-blue-400" />}
              valueStyle={{ color: '#60a5fa' }}
            />
          </AdminCard>
        </Col>
        <Col xs={24} sm={8}>
          <AdminCard className="text-center">
            <Statistic
              title={<span className="text-slate-300">Most Used</span>}
              value={mostUsed}
              suffix={<span className="text-slate-400">articles</span>}
              valueStyle={{ color: '#34d399' }}
            />
          </AdminCard>
        </Col>
        <Col xs={24} sm={8}>
          <AdminCard className="text-center">
            <Statistic
              title={<span className="text-slate-300">Unused Tags</span>}
              value={unusedTags}
              valueStyle={{ color: '#fbbf24' }}
            />
          </AdminCard>
        </Col>
      </Row>

      <AdminCard>
        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Search tags..."
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
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={handleAdd}
            className="w-full sm:w-auto"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderColor: 'transparent'
            }}
          >
            Add New Tag
          </Button>
        </div>

        {/* Tags Table */}
        {tags.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 text-slate-600">🏷️</div>
            <h3 className="text-lg font-medium text-white mb-2">No Tags Found</h3>
            <p className="text-slate-400 mb-6">
              {searchText 
                ? 'No tags match your search criteria.' 
                : 'You haven\'t created any tags yet.'}
            </p>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="large"
              onClick={handleAdd}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderColor: 'transparent'
              }}
            >
              Create Your First Tag
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={filteredTags}
              rowKey="id"
              loading={isLoading}
              pagination={{
                total: filteredTags.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} tags`,
                className: 'custom-pagination'
              }}
              scroll={{ x: 800 }}
              className="custom-table"
            />
          </div>
        )}
      </AdminCard>

      {/* Tag Modal */}
      <Modal
        title={
          <span className="text-white">
            {editingTag ? 'Edit Tag' : 'Add New Tag'}
          </span>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
        className="admin-modal"
        styles={{
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
            color: '#ffffff'
          },
          body: {
            backgroundColor: '#1e293b',
            color: '#ffffff'
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-6"
        >
          <Form.Item
            name="name"
            label={<span className="text-slate-300">Tag Name</span>}
            rules={[{ required: true, message: 'Please enter tag name' }]}
          >
            <Input 
              size="large" 
              placeholder="Enter tag name..."
              onChange={handleNameChange}
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
          </Form.Item>

          <Form.Item
            name="slug"
            label={<span className="text-slate-300">URL Slug</span>}
            rules={[{ required: true, message: 'Please enter URL slug' }]}
          >
            <Input 
              size="large" 
              placeholder="tag-url-slug"
              addonBefore={<span className="text-slate-400">#</span>}
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
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="text-slate-300">Description</span>}
          >
            <TextArea 
              rows={3}
              placeholder="Brief description of the tag..."
              showCount
              maxLength={200}
              style={{
                backgroundColor: 'rgba(51, 65, 85, 0.5)',
                borderColor: '#475569',
                color: '#ffffff'
              }}
              styles={{
                textarea: {
                  backgroundColor: 'transparent',
                  color: '#ffffff'
                }
              }}
            />
          </Form.Item>

          <Form.Item
            name="color"
            label={<span className="text-slate-300">Tag Color</span>}
          >
            <ColorPicker 
              showText 
              format="hex"
              size="large"
              className="w-full"
              presets={[
                {
                  label: 'Recommended',
                  colors: [
                    '#f56565',
                    '#ed8936',
                    '#ecc94b',
                    '#48bb78',
                    '#38b2ac',
                    '#4299e1',
                    '#667eea',
                    '#9f7aea',
                    '#ed64a6',
                  ],
                },
              ]}
            />
          </Form.Item>

          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}
              style={{
                backgroundColor: 'rgba(51, 65, 85, 0.5)',
                borderColor: '#475569',
                color: '#cbd5e1'
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={createTagMutation.isPending || updateTagMutation.isPending}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderColor: 'transparent'
              }}
            >
              {editingTag ? 'Update Tag' : 'Create Tag'}
            </Button>
          </div>
        </Form>
      </Modal>

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

        .admin-modal .ant-modal-content {
          border-radius: 12px !important;
        }

        .admin-modal .ant-modal-header {
          border-radius: 12px 12px 0 0 !important;
        }

        .admin-modal .ant-form-item-label > label {
          color: #cbd5e1 !important;
        }

        .admin-modal .ant-color-picker-trigger {
          border-color: #475569 !important;
        }

        .ant-statistic-title {
          color: #cbd5e1 !important;
        }

        .ant-statistic-content {
          color: #ffffff !important;
        }
      `}</style>
    </AdminLayout>
  );
}
