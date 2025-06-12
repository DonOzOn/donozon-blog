/**
 * Test Admin API functionality
 * This script tests the admin API endpoints to verify data is being fetched correctly
 */

async function testAdminApi() {
  try {
    console.log('🧪 Testing Admin API...');
    
    // Test articles endpoint
    console.log('\n📡 Testing GET /api/admin/articles');
    const response = await fetch('http://localhost:3000/api/admin/articles');
    const result = await response.json();
    
    console.log('✅ Response status:', response.status);
    console.log('📊 Response structure:', {
      success: result.success,
      dataType: typeof result.data,
      isArray: Array.isArray(result.data),
      length: result.data?.length || 0
    });
    
    if (result.data && result.data.length > 0) {
      console.log('📋 Sample article structure:');
      const sample = result.data[0];
      console.log({
        id: sample.id,
        title: sample.title,
        status: sample.status,
        category: sample.categories,
        hasCategory: !!sample.categories,
        created_at: sample.created_at,
        published_at: sample.published_at
      });
      
      // Count by status
      const statusCounts = result.data.reduce((acc, article) => {
        acc[article.status || 'unknown'] = (acc[article.status || 'unknown'] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📈 Articles by status:', statusCounts);
    } else {
      console.log('📭 No articles found');
    }
    
  } catch (error) {
    console.error('❌ Error testing admin API:', error.message);
  }
}

// Run the test
testAdminApi();