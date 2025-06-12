import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    timestamp: new Date().toISOString(),
    environment_variables: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✅' : 'Missing ❌',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set ✅' : 'Missing ❌',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set ✅' : 'Missing ❌',
      NODE_ENV: process.env.NODE_ENV || 'Not set',
    },
    service_key_details: null as any
  };

  // If service key exists, decode it to show details
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const payload = JSON.parse(Buffer.from(serviceKey.split('.')[1], 'base64').toString());
      
      envCheck.service_key_details = {
        role: payload.role,
        issuer: payload.iss,
        expires: new Date(payload.exp * 1000).toISOString(),
        issued_at: new Date(payload.iat * 1000).toISOString(),
        is_service_role: payload.role === 'service_role',
        key_length: serviceKey.length
      };
    } catch (error) {
      envCheck.service_key_details = {
        error: 'Invalid JWT format',
        raw_length: process.env.SUPABASE_SERVICE_ROLE_KEY.length
      };
    }
  }

  return NextResponse.json(envCheck);
}
