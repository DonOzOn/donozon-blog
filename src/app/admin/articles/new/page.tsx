'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Switch, 
  message,
  Typography,
  Row,
  Col,
  Avatar,
  Tag,
  Space
} from 'antd';
import { 
  SaveOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateArticle } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { useTags, useSearchTags } from '@/hooks/useTags';
import RichTextEditorWithImageKit from '@/components/RichTextEditorWithImageKit';
import AdminLayout from '@/components/AdminLayout';
import AdminCard from '@/components/AdminCard';
import ImageUploadWithImageKit from '@/components/ImageUploadWithImageKit';
import { imageManagementService } from '@/services/image-management.service';
import Link from 'next/link';

const { Text } = Typography;
const { TextArea } = Input;

interface ArticleForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string;
  featured_image_url?: string;
  featured_image_alt?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  is_featured: boolean;
  status: 'draft' | 'published';
  tags: string[];
}

export default function NewArticlePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm<ArticleForm>();
  const [loading, setLoading] = useState(false);
  const [createdArticleId, setCreatedArticleId] = useState<string | null>(null);
  
  const { data: categories = [] } = useCategories();
  const { data: allTags = [] } = useTags();
  const createArticleMutation = useCreateArticle();

  useEffect(() => {
    // Only redirect if auth loading is complete and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log('🔐 Not authenticated, redirecting to admin login');
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while auth is being checked
  if (isLoading) {
    return (
      <AdminLayout title="Create New Article" description="Write and publish your next blog post">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-slate-400">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Only return null after loading is complete and user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    form.setFieldsValue({ slug });
  };

  const handleSubmit = async (values: ArticleForm) => {
    setLoading(true);
    try {
      console.log('🆕 New Article: Form values received:', values);

      // Validate required fields
      if (!values.title || !values.slug || !values.excerpt || !values.content || !values.category_id) {
        message.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Generate reading time (rough calculation)
      const wordsPerMinute = 200;
      const wordCount = values.content.split(/\s+/).filter(word => word.length > 0).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

      const articleData = {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        content: values.content,
        category_id: values.category_id,
        featured_image_url: values.featured_image_url || null,
        featured_image_alt: values.featured_image_alt || null,
        meta_title: values.meta_title || null,
        meta_description: values.meta_description || null,
        meta_keywords: values.meta_keywords || null,
        is_featured: values.is_featured || false,
        status: values.status || 'draft',
        reading_time: readingTime,
        published_at: values.status === 'published' ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('🆕 New Article: Creating article with data:', articleData);

      // Create the article
      const createdArticle = await createArticleMutation.mutateAsync(articleData);
      const articleId = createdArticle.id;
      setCreatedArticleId(articleId);

      console.log('🆕 New Article: Article created with ID:', articleId);

      // Enhanced image tracking: adopt orphaned images and track usage
      try {
        const trackedCount = await imageManagementService.updateArticleImageUsageEnhanced(
          articleId, 
          values.content, 
          values.featured_image_url
        );
        console.log(`🆕 New Article: Enhanced image tracking completed - ${trackedCount} images processed`);
      } catch (imageError) {
        console.warn('🆕 New Article: Failed to track images:', imageError);
        // Don't fail the article creation if image tracking fails
      }

      message.success('Article created successfully!');
      router.push('/admin/articles');
    } catch (error: any) {
      console.error('=== DETAILED ERROR LOGGING ===');
      console.error('Error creating article:', error);
      
      // Enhanced error logging
      if (error) {
        console.error('Error type:', typeof error);
        console.error('Error constructor:', error.constructor?.name);
        console.error('Error string representation:', String(error));
        
        try {
          console.error('Full error object (JSON):', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        } catch (jsonError) {
          console.error('Could not JSON stringify error:', jsonError);
        }
        
        // Check various error properties
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        console.error('Error stack:', error.stack);
        
        // For Supabase errors
        if (error.error) {
          console.error('Nested error:', error.error);
        }
        
        // Build user-friendly error message
        let userMessage = 'Failed to create article';
        if (error.message && error.message !== '{}' && error.message !== '[object Object]') {
          userMessage += `: ${error.message}`;
        } else if (error.code) {
          userMessage += `. Error code: ${error.code}`;
        } else if (error.details) {
          userMessage += `. Details: ${error.details}`;
        } else {
          userMessage += '. Please check the console for detailed error information.';
        }
        
        message.error(userMessage);
      } else {
        console.error('Error is null or undefined');
        message.error('Failed to create article. Unknown error occurred.');
      }
      console.error('=== END ERROR LOGGING ===');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const values = await form.validateFields();
      await handleSubmit({ ...values, status: 'draft' });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePublish = async () => {
    try {
      const values = await form.validateFields();
      await handleSubmit({ ...values, status: 'published' });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <AdminLayout 
      title="Create New Article" 
      description="Write and publish your next blog post"
    >
      {/* Back Navigation */}
      <div className="mb-6">
        <Link href="/admin/articles">
          <Button 
            icon={<ArrowLeftOutlined />} 
            type="text" 
            className="text-slate-400 hover:text-white"
          >
            Back to Articles
          </Button>
        </Link>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 'draft',
          is_featured: false,
          tags: [],
        }}
      >
        <Row gutter={[24, 0]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            <AdminCard className="mb-6">
              <Form.Item
                name="title"
                label={<span className="text-slate-300">Article Title</span>}
                rules={[{ required: true, message: 'Please enter article title' }]}
              >
                <Input 
                  size="large" 
                  placeholder="Enter article title..."
                  onChange={handleTitleChange}
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
                  placeholder="article-url-slug"
                  addonBefore={<span className="text-slate-400">https://donozon.com/articles/</span>}
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
                name="excerpt"
                label={<span className="text-slate-300">Excerpt</span>}
                rules={[{ required: true, message: 'Please enter article excerpt' }]}
              >
                <TextArea 
                  rows={3}
                  placeholder="Brief description of the article..."
                  showCount
                  maxLength={300}
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
                name="content"
                label={<span className="text-slate-300">Content</span>}
                rules={[{ required: true, message: 'Please enter article content' }]}
              >
                <RichTextEditorWithImageKit
                  placeholder="Write your article content here... You can paste images directly!"
                  height={500}
                  articleId={createdArticleId || undefined}
                />
              </Form.Item>
            </AdminCard>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            {/* Publish Actions */}
            <AdminCard title="Publish" className="mb-6">
              <Space direction="vertical" className="w-full">
                <Button 
                  type="default" 
                  block 
                  icon={<SaveOutlined />}
                  onClick={handleSaveDraft}
                  loading={loading}
                  style={{
                    backgroundColor: 'rgba(51, 65, 85, 0.5)',
                    borderColor: '#475569',
                    color: '#cbd5e1'
                  }}
                >
                  Save Draft
                </Button>
                <Button 
                  type="primary" 
                  block 
                  icon={<EyeOutlined />}
                  onClick={handlePublish}
                  loading={loading}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderColor: 'transparent'
                  }}
                >
                  Publish Article
                </Button>
              </Space>
            </AdminCard>

            {/* Author Information */}
            <AdminCard title="Author" className="mb-6">
              <div className="flex items-center space-x-3">
                <Avatar icon={<UserOutlined />} className="bg-gradient-to-r from-blue-500 to-purple-500" />
                <div>
                  <div className="font-medium text-white">DonOzOn</div>
                  <div className="text-sm text-slate-400">Default Author</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                Articles are automatically attributed to DonOzOn unless otherwise specified.
              </div>
            </AdminCard>

            {/* Category */}
            <AdminCard title="Category" className="mb-6">
              <Form.Item
                name="category_id"
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select 
                  placeholder="Select category"
                  style={{
                    backgroundColor: 'rgba(51, 65, 85, 0.5)',
                    borderColor: '#475569'
                  }}
                  dropdownStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {categories.map(category => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </AdminCard>

            {/* Tags */}
            <AdminCard title="Tags" className="mb-6">
              <Form.Item name="tags">
                <Select
                  mode="tags"
                  placeholder="Add or select existing tags..."
                  style={{ width: '100%' }}
                  tokenSeparators={[',']}
                  options={allTags.map(tag => ({
                    label: (
                      <div className="flex items-center justify-between">
                        <span>{tag.name}</span>
                        <Tag color={tag.color || 'default'}>
                          {tag.usage_count || 0}
                        </Tag>
                      </div>
                    ),
                    value: tag.name,
                  }))}
                  filterOption={(input, option) =>
                    (option?.value as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                  dropdownStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  popupRender={(menu) => (
                    <div>
                      {menu}
                      <div className="p-2 border-t border-white/10">
                        <small className="text-slate-400">
                          Type to create new tags or select from existing ones
                        </small>
                      </div>
                    </div>
                  )}
                />
              </Form.Item>
            </AdminCard>

            {/* Featured Image */}
            <AdminCard title="Featured Image" className="mb-6">
              <ImageUploadWithImageKit
                onImageUploaded={(imageData) => {
                  form.setFieldsValue({
                    featured_image_url: imageData.url,
                    featured_image_alt: imageData.altText
                  });
                }}
                currentImageUrl={form.getFieldValue('featured_image_url')}
                currentAltText={form.getFieldValue('featured_image_alt')}
                articleId={createdArticleId || undefined}
              />
              
              {/* Hidden form fields to store the image data */}
              <Form.Item name="featured_image_url" style={{ display: 'none' }}>
                <Input />
              </Form.Item>
              <Form.Item name="featured_image_alt" style={{ display: 'none' }}>
                <Input />
              </Form.Item>
            </AdminCard>

            {/* Article Settings */}
            <AdminCard title="Settings" className="mb-6">
              <Form.Item name="is_featured" valuePropName="checked">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Featured Article</span>
                  <Switch />
                </div>
              </Form.Item>
            </AdminCard>

            {/* SEO Settings */}
            <AdminCard title="SEO Settings">
              <Form.Item name="meta_title" label={<span className="text-slate-300">Meta Title</span>}>
                <Input 
                  placeholder="SEO title" 
                  maxLength={60} 
                  showCount 
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
              
              <Form.Item name="meta_description" label={<span className="text-slate-300">Meta Description</span>}>
                <TextArea 
                  rows={3} 
                  placeholder="SEO description" 
                  maxLength={160} 
                  showCount 
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
              
              <Form.Item name="meta_keywords" label={<span className="text-slate-300">Meta Keywords</span>}>
                <Select
                  mode="tags"
                  placeholder="SEO keywords"
                  tokenSeparators={[',']}
                  dropdownStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                />
              </Form.Item>
            </AdminCard>
          </Col>
        </Row>
      </Form>

      <style jsx global>{`
        .ant-form-item-label > label {
          color: #cbd5e1 !important;
        }

        .ant-switch {
          background-color: rgba(51, 65, 85, 0.5) !important;
        }

        .ant-switch-checked {
          background-color: #3b82f6 !important;
        }

        .ant-select-selector {
          background-color: rgba(51, 65, 85, 0.5) !important;
          border-color: #475569 !important;
          color: #ffffff !important;
        }

        .ant-select-selection-placeholder {
          color: #94a3b8 !important;
        }

        .ant-select-arrow {
          color: #94a3b8 !important;
        }

        .ant-input-number {
          background-color: rgba(51, 65, 85, 0.5) !important;
          border-color: #475569 !important;
          color: #ffffff !important;
        }

        .ant-input-number-input {
          color: #ffffff !important;
        }
      `}</style>
    </AdminLayout>
  );
}