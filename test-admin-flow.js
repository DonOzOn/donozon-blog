/**
 * Test Admin Data Flow
 * Simulates the exact data flow used in the admin dashboard
 */

async function testAdminFlow() {
  try {
    console.log('🔍 Testing Admin Data Flow...');
    
    // Simulate the adminApiService.getArticles() call
    const response = await fetch('http://localhost:3000/api/admin/articles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    console.log('📡 Admin API Service Result:');
    console.log('  Success:', result.success);
    console.log('  Data type:', typeof result.data);
    console.log('  Is array:', Array.isArray(result.data));
    
    // This is what the hook returns
    const articlesData = result.data || [];
    
    console.log('\n📊 Dashboard Calculations:');
    console.log('  articlesData length:', articlesData.length);
    
    // Simulate dashboard calculations
    const articles = articlesData || [];
    const totalArticles = articles.length;
    const publishedArticles = articles.filter(a => a.status === 'published').length;
    const totalViews = articles.reduce((sum, article) => sum + (article.view_count || 0), 0);
    
    console.log('  Total Articles:', totalArticles);
    console.log('  Published Articles:', publishedArticles);
    console.log('  Total Views:', totalViews);
    
    console.log('\n📋 Article Status Breakdown:');
    const statusBreakdown = articles.reduce((acc, article) => {
      const status = article.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    console.log(statusBreakdown);
    
  } catch (error) {
    console.error('❌ Error in admin flow test:', error);
  }
}

testAdminFlow();