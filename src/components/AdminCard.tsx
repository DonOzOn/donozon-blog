/**
 * Admin Card Component
 * Consistent card styling for admin pages
 */

import { Card } from 'antd';
import { ReactNode } from 'react';

interface AdminCardProps {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  loading?: boolean;
  extra?: ReactNode;
  headStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
}

export default function AdminCard({ 
  title, 
  children, 
  className = '', 
  loading = false,
  extra,
  headStyle = {},
  bodyStyle = {},
  ...props 
}: AdminCardProps) {
  return (
    <Card
      title={title ? <span className="text-xl font-bold text-white">{title}</span> : undefined}
      extra={extra}
      loading={loading}
      className={`glass-card border-white/10 bg-slate-800/50 ${className}`}
      styles={{
        header: {
          backgroundColor: 'transparent',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          padding: '16px 24px',
          ...headStyle
        },
        body: {
          padding: '24px',
          ...bodyStyle
        }
      }}
      {...props}
    >
      {children}
    </Card>
  );
}
