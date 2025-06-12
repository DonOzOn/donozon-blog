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
  Modal,
  Form,
  Switch,
  ColorPicker
} from 'antd';
import { 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useCategories, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory 
} from '@/hooks/useCategories';
import AdminLayout from '@/components/AdminLayout';
import AdminCard from '@/components/AdminCard';
import type { ColumnsType } from 'antd/es/table';
import type { Category, CategoryInsert } from '@/types/database';

const { TextArea } = Input;

export default function CategoriesManagePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();
  
  const { data: categories = [], isLoading, error, refetch } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  // Debug logging
  useEffect(() => {
    console.log('📊 Categories Management Debug:');
    console.log('  isLoading:', isLoading);
    console.log('  error:', error);
    console.log('  categories:', categories);
    console.log('  categories length:', categories?.length);
  }, [isLoading, error, categories]);

  if (!isAuthenticated) {
    return null;
  }

  // Handle loading state
  if (isLoading) {
    return (
      <AdminLayout title="Manage Categories" description="Create and organize your blog categories">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-slate-400">Loading categories...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Handle error state
  if (error) {
    return (
      <AdminLayout title="Manage Categories" description="Create and organize your blog categories">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2 text-white">Error Loading Categories</h2>
            <p className="text-slate-400 mb-4">
              {error?.message || 'Failed to load categories'}
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
      await deleteCategoryMutation.mutateAsync(id);
      message.success('Category deleted successfully');
      refetch();
    } catch {
      message.error('Failed to delete category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      is_active: category.is_active,
      sort_order: category.sort_order,
    });
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    form.setFieldsValue({
      is_active: true,
      sort_order: 0,
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
      const categoryData: CategoryInsert = {
        name: values.name,
        slug: values.slug,
        description: values.description || null,
        color: typeof values.color === 'string' ? values.color : values.color?.toHexString?.() || null,
        is_active: values.is_active,
        sort_order: values.sort_order || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({
          id: editingCategory.id,
          data: { ...categoryData, updated_at: new Date().toISOString() }
        });
        message.success('Category updated successfully');
      } else {
        await createCategoryMutation.mutateAsync(categoryData);
        message.success('Category created successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
      refetch();
    } catch (error) {
      console.error('Error saving category:', error);
      message.error('Failed to save category');
    }
  };

  // Filter categories based on search
  const filteredCategories = categories.filter((category: Category) =>
    !searchText || 
    category.name.toLowerCase().includes(searchText.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Category> = [
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
            <div className="text-sm text-slate-400">/{record.slug}</div>
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
      title: 'Status',
      dataIndex: 'is_active',
      key: 'status',
      width: 100,
      render: (isActive) => (
        <Tag 
          color={isActive ? 'green' : 'red'}
          className={isActive 
            ? 'bg-green-500/20 border-green-400 text-green-300' 
            : 'bg-red-500/20 border-red-400 text-red-300'
          }
        >
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Sort Order',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 100,
      render: (order) => (
        <span className="text-slate-300">{order || 0}</span>
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
            title="Delete Category"
            description="Are you sure you want to delete this category?"
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

  return (
    <AdminLayout 
      title="Manage Categories" 
      description="Create and organize your blog categories"
    >
      <AdminCard>
        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Search categories..."
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
            Add New Category
          </Button>
        </div>

        {/* Categories Table */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 text-slate-600">🏷️</div>
            <h3 className="text-lg font-medium text-white mb-2">No Categories Found</h3>
            <p className="text-slate-400 mb-6">
              {searchText 
                ? 'No categories match your search criteria.' 
                : 'You haven\'t created any categories yet.'}
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
              Create Your First Category
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={filteredCategories}
              rowKey="id"
              loading={isLoading}
              pagination={{
                total: filteredCategories.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} categories`,
                className: 'custom-pagination'
              }}
              scroll={{ x: 800 }}
              className="custom-table"
            />
          </div>
        )}
      </AdminCard>

      {/* Category Modal */}
      <Modal
        title={
          <span className="text-white">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
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
            label={<span className="text-slate-300">Category Name</span>}
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input 
              size="large" 
              placeholder="Enter category name..."
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
              placeholder="category-url-slug"
              addonBefore={<span className="text-slate-400">https://donozon.com/categories/</span>}
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
              placeholder="Brief description of the category..."
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

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="color"
              label={<span className="text-slate-300">Category Color</span>}
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

            <Form.Item
              name="sort_order"
              label={<span className="text-slate-300">Sort Order</span>}
            >
              <Input 
                type="number" 
                placeholder="0"
                min={0}
                size="large"
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
          </div>

          <Form.Item name="is_active" valuePropName="checked">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Active Category</span>
              <Switch />
            </div>
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
              loading={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderColor: 'transparent'
              }}
            >
              {editingCategory ? 'Update Category' : 'Create Category'}
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

        .admin-modal .ant-switch {
          background-color: rgba(51, 65, 85, 0.5) !important;
        }

        .admin-modal .ant-switch-checked {
          background-color: #3b82f6 !important;
        }

        .admin-modal .ant-color-picker-trigger {
          border-color: #475569 !important;
        }
      `}</style>
    </AdminLayout>
  );
}
