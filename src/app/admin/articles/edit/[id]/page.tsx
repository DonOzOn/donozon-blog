/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Switch, 
  message,
  Row,
  Col,
  Avatar,
  Space
} from 'antd';
import { 
  SaveOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  EditOutlined
} from '@ant-design/icons';
import { Tag } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateArticle, useArticleById } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { useTags } from '@/hooks/useTags';
import RichTextEditorWithImageKit from '@/components/RichTextEditorWithImageKit';
import AdminLayout from '@/components/AdminLayout';
import AdminCard from '@/components/AdminCard';
import ImageUploadWithImageKit from '@/components/ImageUploadWithImageKit';
import Link from 'next/link';

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

export default function EditArticlePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [form] = Form.useForm<ArticleForm>();
  const [loading, setLoading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [currentAltText, setCurrentAltText] = useState<string>('');
  
  const { data: categories = [] } = useCategories();
  const { data: allTags = [] } = useTags();
  const { data: article, isLoading: articleLoading } = useArticleById(params.id as string);
  const updateArticleMutation = useUpdateArticle();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin');
      return;
    }

    if (article) {
      // Set current image data for the ImageUpload component
      setCurrentImageUrl(article.featured_image_url || '');
      setCurrentAltText(article.featured_image_alt || '');
      
      // Populate form with article data
      form.setFieldsValue({
        title: article.title || '',
        slug: article.slug || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        category_id: article.category_id || '',
        featured_image_url: article.featured_image_url || '',
        featured_image_alt: article.featured_image_alt || '',
        meta_title: article.meta_title || '',
        meta_description: article.meta_description || '',
        meta_keywords: article.meta_keywords || [],
        is_featured: article.is_featured || false,
        status: (article.status as 'draft' | 'published') || 'draft',
        tags: [], // Note: you'll need to handle tags separately
      });
    }
  }, [isAuthenticated, router, article, form]);

  useEffect(() => {
    if (!articleLoading && !article && params.id) {
      message.error('Article not found');
      router.push('/admin/articles');
    }
  }, [article, articleLoading, params.id, router]);

  if (!isAuthenticated || articleLoading) {
    return (
      <AdminLayout title="Edit Article" description="Update and manage your blog post">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-slate-400">Loading article...</p>
          </div>
        </div>
      </AdminLayout>
    );
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
    if (!article) return;
    
    setLoading(true);
    try {
      console.log('📝 Edit Article: Form values received:', values);
      console.log('📝 Edit Article: Current image URL from state:', currentImageUrl);
      
      // Generate reading time (rough calculation)
      const wordsPerMinute = 200;
      const wordCount = values.content.split(/\s+/).filter(word => word.length > 0).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

      // Clean the data and handle empty image fields
      const updateData = {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        content: values.content,
        category_id: values.category_id || null,
        featured_image_url: currentImageUrl || undefined,
        featured_image_alt: currentAltText || undefined,
        meta_title: values.meta_title || null,
        meta_description: values.meta_description || null,
        meta_keywords: values.meta_keywords || null,
        is_featured: values.is_featured || false,
        status: values.status || 'draft',
        reading_time: readingTime,
        updated_at: new Date().toISOString(),
        published_at: values.status === 'published' && !article.published_at 
          ? new Date().toISOString() 
          : article.published_at,
      };

      console.log('📝 Edit Article: Updating article with data:', updateData);

      // Update the article (this will automatically trigger image tracking)
      await updateArticleMutation.mutateAsync({ 
        id: article.id!, 
        data: updateData 
      });

      console.log('📝 Edit Article: Article updated successfully with automatic image tracking');
      
      message.success('Article updated successfully!');
      router.push('/admin/articles');
    } catch (error: any) {
      console.error('❌ Edit Article: Error updating article:', error);
      
      // Enhanced error handling
      let errorMessage = 'Failed to update article. Please try again.';
      
      if (error.message) {
        if (error.message.includes('slug')) {
          errorMessage = 'Article slug already exists. Please choose a different URL slug.';
        } else if (error.message.includes('required')) {
          errorMessage = 'Please fill in all required fields.';
        } else {
          errorMessage = error.message;
        }
      }
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      // Sync current image state with form before validation
      form.setFieldsValue({
        featured_image_url: currentImageUrl || undefined,
        featured_image_alt: currentAltText || undefined,
      });
      
      const values = await form.validateFields();
      await handleSubmit({ ...values, status: 'draft' });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePublish = async () => {
    try {
      // Sync current image state with form before validation
      form.setFieldsValue({
        featured_image_url: currentImageUrl || undefined,
        featured_image_alt: currentAltText || undefined,
      });
      
      const values = await form.validateFields();
      await handleSubmit({ ...values, status: 'published' });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <AdminLayout 
      title={
        <div className="flex items-center gap-3">
          <EditOutlined className="text-blue-400" />
          Edit Article
        </div>
      } 
      description="Update and manage your blog post"
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
        onFinish={handleSubmit}
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
                  articleId={params.id as string}
                />
              </Form.Item>
            </AdminCard>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            {/* Publish Actions */}
            <AdminCard title="Update" className="mb-6">
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
                  Save as Draft
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
                  Update & Publish
                </Button>
                {article?.slug && (
                  <Button 
                    type="link" 
                    block 
                    onClick={() => window.open(`/articles/${article.slug}`, '_blank')}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    View Article
                  </Button>
                )}
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
                All articles are attributed to DonOzOn by default.
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
                  {categories.map((category: { id: any; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                    <Select.Option key={category.id.toString()} value={category.id}>
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
                />
              </Form.Item>
            </AdminCard>

            {/* Featured Image */}
            <AdminCard title="Featured Image" className="mb-6">
              <ImageUploadWithImageKit
                onImageUploaded={(imageData) => {
                  setCurrentImageUrl(imageData.url);
                  setCurrentAltText(imageData.altText);
                  form.setFieldsValue({
                    featured_image_url: imageData.url,
                    featured_image_alt: imageData.altText
                  });
                }}
                onImageDeleted={(deletedImageUrl) => {
                  console.log('📝 Edit Article: Image deleted:', deletedImageUrl);
                  setCurrentImageUrl('');
                  setCurrentAltText('');
                  form.setFieldsValue({
                    featured_image_url: '',
                    featured_image_alt: ''
                  });
                }}
                currentImageUrl={currentImageUrl}
                currentAltText={currentAltText}
                articleId={params.id as string}
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
