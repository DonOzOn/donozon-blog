/**
 * Simple Debug Component for Admin Dashboard
 * Displays connection status and basic stats
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, Alert, Button, Space, Badge } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';

interface DebugInfo {
  supabase: boolean;
  apiRoute: boolean;
  articlesCount: number;
  categoriesCount: number;
  errors: string[];
}

export default function AdminDebugCard() {
  const [debug, setDebug] = useState<DebugInfo>({
    supabase: false,
    apiRoute: false,
    articlesCount: 0,
    categoriesCount: 0,
    errors: []
  });
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    const errors: string[] = [];
    let articlesCount = 0;
    let categoriesCount = 0;
    let supabaseOk = false;
    let apiRouteOk = false;

    try {
      // Test API route
      const apiResponse = await fetch('/api/admin/articles');
      const apiResult = await apiResponse.json();
      
      if (apiResponse.ok && apiResult.success) {
        apiRouteOk = true;
        articlesCount = apiResult.data?.length || 0;
        supabaseOk = true; // If API works, Supabase is working
      } else {
        errors.push(`API Route Error: ${apiResult.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      errors.push(`API Connection Error: ${error.message}`);
    }

    try {
      // Test categories
      const catResponse = await fetch('/api/admin/categories');
      if (catResponse.ok) {
        const catResult = await catResponse.json();
        categoriesCount = catResult.data?.length || 0;
      }
    } catch (error: any) {
      errors.push(`Categories Error: ${error.message}`);
    }

    setDebug({
      supabase: supabaseOk,
      apiRoute: apiRouteOk,
      articlesCount,
      categoriesCount,
      errors
    });
    setLoading(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <Card 
      title="🔧 System Status" 
      extra={
        <Button 
          icon={<ReloadOutlined />} 
          onClick={runDiagnostics}
          loading={loading}
          size="small"
        >
          Refresh
        </Button>
      }
      className="glass-card border-white/10 bg-slate-800/50 mb-6"
      styles={{
        header: { 
          backgroundColor: 'transparent', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          padding: '16px 24px'
        },
        body: { padding: '24px' }
      }}
    >
      <Space direction="vertical" className="w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            {debug.supabase ? (
              <CheckCircleOutlined className="text-green-400" />
            ) : (
              <ExclamationCircleOutlined className="text-red-400" />
            )}
            <span className="text-white">Supabase Connection</span>
            <Badge 
              status={debug.supabase ? 'success' : 'error'} 
              text={debug.supabase ? 'Connected' : 'Failed'} 
            />
          </div>
          
          <div className="flex items-center gap-2">
            {debug.apiRoute ? (
              <CheckCircleOutlined className="text-green-400" />
            ) : (
              <ExclamationCircleOutlined className="text-red-400" />
            )}
            <span className="text-white">API Routes</span>
            <Badge 
              status={debug.apiRoute ? 'success' : 'error'} 
              text={debug.apiRoute ? 'Working' : 'Failed'} 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-400">{debug.articlesCount}</div>
            <div className="text-sm text-blue-300">Articles</div>
          </div>
          <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <div className="text-2xl font-bold text-purple-400">{debug.categoriesCount}</div>
            <div className="text-sm text-purple-300">Categories</div>
          </div>
        </div>

        {debug.errors.length > 0 && (
          <Alert
            message="System Errors"
            description={
              <ul className="mt-2">
                {debug.errors.map((error, index) => (
                  <li key={index} className="text-sm">• {error}</li>
                ))}
              </ul>
            }
            type="error"
            showIcon
            className="bg-red-500/10 border-red-500/20"
          />
        )}
      </Space>
    </Card>
  );
}
