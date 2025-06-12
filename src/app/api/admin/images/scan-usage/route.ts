import { NextRequest, NextResponse } from 'next/server';
import { scanAllArticlesForImageUsage } from '@/services/image-usage-tracking.service';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Admin: Starting image usage scan...');
    
    const result = await scanAllArticlesForImageUsage();
    
    console.log('✅ Admin: Image usage scan completed', result);
    
    return NextResponse.json({
      success: true,
      message: 'Image usage scan completed successfully',
      data: result,
    });

  } catch (error) {
    console.error('❌ Admin: Image usage scan failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Scan failed',
      },
      { status: 500 }
    );
  }
}