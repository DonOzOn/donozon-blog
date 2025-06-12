'use client';

import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function AdminLoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('🔐 Already authenticated, redirecting to dashboard');
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = async (values: { username: string; password: string }) => {
    console.log('🔐 Attempting login for:', values.username);
    setLoading(true);
    setError('');

    try {
      const success = login(values.username, values.password);
      if (success) {
        console.log('🔐 Login successful, redirecting to dashboard');
        router.push('/admin/dashboard');
      } else {
        console.log('🔐 Login failed - invalid credentials');
        setError('Invalid username or password. Please try again.');
      }
    } catch (err) {
      console.error('🔐 Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="mt-2 text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-slate-800/80 border-slate-700/50 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserOutlined className="text-2xl text-white" />
          </div>
          <Title level={2} style={{ color: '#f8fafc', marginBottom: '8px' }}>Admin Login</Title>
          <Text style={{ color: '#94a3b8' }}>Sign in to manage your blog content</Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            className="mb-6"
            style={{
              backgroundColor: 'rgba(153, 27, 27, 0.2)',
              borderColor: 'rgba(185, 28, 28, 0.3)',
              color: '#fca5a5'
            }}
          />
        )}

        <Form
          form={form}
          name="admin_login"
          onFinish={handleLogin}
          size="large"
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            label={<span className="text-slate-300 font-medium">Username</span>}
            rules={[{ required: true, message: 'Please enter your username!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-slate-400" />}
              placeholder="Username"
              style={{
                backgroundColor: 'rgba(51, 65, 85, 0.3)',
                borderColor: '#475569',
                color: '#f8fafc'
              }}
              styles={{
                input: {
                  backgroundColor: 'transparent !important',
                  color: '#f8fafc !important'
                }
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="text-slate-300 font-medium">Password</span>}
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-slate-400" />}
              placeholder="Password"
              style={{
                backgroundColor: 'rgba(51, 65, 85, 0.3)',
                borderColor: '#475569',
                color: '#f8fafc'
              }}
              styles={{
                input: {
                  backgroundColor: 'transparent !important',
                  color: '#f8fafc !important'
                }
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 border-none hover:from-orange-600 hover:to-red-600 font-semibold text-base"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-6">
          <Text style={{ color: '#64748b', fontSize: '14px' }}>
            Default credentials: admin / donozon2024
          </Text>
        </div>
      </Card>

      {/* Custom Styles - Scoped to admin login page only */}
      <style jsx>{`
        .admin-login :global(.ant-form-item-label > label) {
          color: #cbd5e1 !important;
          font-weight: 500 !important;
        }

        .admin-login :global(.ant-input) {
          background-color: rgba(51, 65, 85, 0.3) !important;
          border-color: #475569 !important;
          color: #f8fafc !important;
        }

        .admin-login :global(.ant-input::placeholder) {
          color: #94a3b8 !important;
        }

        .admin-login :global(.ant-input:focus),
        .admin-login :global(.ant-input-focused) {
          background-color: rgba(51, 65, 85, 0.4) !important;
          border-color: #0ea5e9 !important;
          box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2) !important;
          color: #f8fafc !important;
        }

        .admin-login :global(.ant-input-password) {
          background-color: rgba(51, 65, 85, 0.3) !important;
          border-color: #475569 !important;
        }

        .admin-login :global(.ant-input-password .ant-input) {
          background-color: transparent !important;
          color: #f8fafc !important;
        }

        .admin-login :global(.ant-input-password:focus-within),
        .admin-login :global(.ant-input-password.ant-input-affix-wrapper-focused) {
          background-color: rgba(51, 65, 85, 0.4) !important;
          border-color: #0ea5e9 !important;
          box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2) !important;
        }

        .admin-login :global(.ant-input-password .ant-input-suffix) {
          color: #94a3b8 !important;
        }

        .admin-login :global(.ant-form-item-explain-error) {
          color: #fca5a5 !important;
          font-weight: 400 !important;
        }

        .admin-login :global(.ant-card) {
          background: rgba(30, 41, 59, 0.8) !important;
          border: 1px solid rgba(71, 85, 105, 0.5) !important;
          backdrop-filter: blur(12px) !important;
        }

        .admin-login :global(.ant-btn-primary) {
          background: linear-gradient(135deg, #f97316 0%, #dc2626 100%) !important;
          border: none !important;
          box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3) !important;
          transition: all 0.3s ease !important;
          color: #ffffff !important;
          font-weight: 600 !important;
        }

        .admin-login :global(.ant-btn-primary:hover) {
          background: linear-gradient(135deg, #ea580c 0%, #b91c1c 100%) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4) !important;
          color: #ffffff !important;
        }

        .admin-login :global(.ant-btn-primary:active) {
          transform: translateY(0) !important;
        }

        .admin-login :global(.ant-input-prefix) {
          color: #94a3b8 !important;
        }

        .admin-login :global(.ant-input:hover) {
          border-color: #64748b !important;
          background-color: rgba(51, 65, 85, 0.35) !important;
        }

        .admin-login :global(.ant-input-password:hover) {
          border-color: #64748b !important;
          background-color: rgba(51, 65, 85, 0.35) !important;
        }
      `}</style>
    </div>
  );
}