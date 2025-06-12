/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';

export default function EnvCheckPage() {
  const [envCheck, setEnvCheck] = useState<any>(null);

  useEffect(() => {
    // Check environment variables (client-side check)
    const checkEnv = async () => {
      try {
        const response = await fetch('/api/env-check');
        const data = await response.json();
        setEnvCheck(data);
      } catch (error) {
        console.error('Error checking environment:', error);
        setEnvCheck({ error: 'Failed to check environment' });
      }
    };

    checkEnv();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Check</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Environment Status:</h2>
        <pre className="bg-white p-4 rounded border text-sm overflow-auto">
          {envCheck ? JSON.stringify(envCheck, null, 2) : 'Loading...'}
        </pre>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">How to check console logs:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Open Developer Tools (F12)</li>
          <li>Go to Console tab</li>
          <li>Look for &quot;🔧 Supabase Configuration Check&quot; messages</li>
          <li>Check if all environment variables show &quot;Set&quot;</li>
        </ol>
      </div>
    </div>
  );
}
