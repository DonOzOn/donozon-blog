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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
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
          <Title level={2} className="text-white mb-2">Admin Login</Title>
          <Text className="text-slate-400">Sign in to manage your blog content</Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            className="mb-6 bg-red-900/20 border-red-700/30"
          />
        )}

        <Form
          form={form}
          name="admin_login"
          onFinish={handleLogin}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your username!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-slate-400" />}
              placeholder="Username"
              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-slate-400" />}
              placeholder="Password"
              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
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
          <Text className="text-slate-500 text-sm">
            Default credentials: admin / donozon2024
          </Text>
        </div>
      </Card>
    </div>
  );
}