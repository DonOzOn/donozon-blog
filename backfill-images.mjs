import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function backfillImageData() {
  console.log('🔄 Backfilling image data from existing articles...');
  
  try {
    // Get all articles
    const { data: articles, error: articleError } = await supabase
      .from('articles')
      .select('id, title, content, featured_image_url');
      
    if (articleError) {
      console.error('❌ Error fetching articles:', articleError);
      return;
    }
    
    console.log(`📄 Found ${articles.length} articles to process`);
    
    let totalImagesFound = 0;
    let totalImagesAdded = 0;
    
    for (const article of articles) {
      console.log(`\n📝 Processing: "${article.title}"`);
      
      const imageUrls = new Set(); // Use Set to avoid duplicates
      
      // Check for featured image
      if (article.featured_image_url) {
        imageUrls.add(article.featured_image_url);
        console.log(`  🖼️  Featured image found`);
      }
      
      // Extract images from content
      if (article.content) {
        // Look for various image URL patterns
        const patterns = [
          /https:\/\/ik\.imagekit\.io\/[^\s"'<>)]+/g,  // ImageKit URLs
          /https:\/\/[^\/]*\.supabase\.co\/storage\/[^\s"'<>)]+/g,  // Supabase storage URLs
          /https:\/\/[^\/]*\.amazonaws\.com\/[^\s"'<>)]+\.(jpg|jpeg|png|gif|webp)/gi,  // AWS S3 URLs
          /https:\/\/[^\/]*\.(jpg|jpeg|png|gif|webp)/gi  // Other image URLs
        ];
        
        patterns.forEach(pattern => {
          const matches = article.content.match(pattern) || [];
          matches.forEach(url => imageUrls.add(url));
        });
        
        if (imageUrls.size > 1 || (imageUrls.size === 1 && !article.featured_image_url)) {
          console.log(`  📷 ${imageUrls.size - (article.featured_image_url ? 1 : 0)} content images found`);
        }
      }
      
      totalImagesFound += imageUrls.size;
      
      // Add each image to the database
      for (const imageUrl of imageUrls) {
        try {
          // Extract filename from URL
          const urlParts = imageUrl.split('/');
          let fileName = urlParts[urlParts.length - 1];
          
          // Clean up filename (remove query params)
          fileName = fileName.split('?')[0];
          
          // Generate a file ID (for ImageKit URLs, extract it; for others, create one)
          let fileId = '';
          if (imageUrl.includes('imagekit.io')) {
            const pathParts = imageUrl.split('/');
            fileId = pathParts[pathParts.length - 1].split('?')[0];
          } else {
            // For non-ImageKit URLs, create a hash-based ID
            fileId = btoa(imageUrl).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
          }
          
          // Check if this image URL already exists
          const { data: existingImage } = await supabase
            .from('article_images')
            .select('id')
            .eq('imagekit_url', imageUrl)
            .single();
            
          if (existingImage) {
            console.log(`    ⏭️  Skipping duplicate: ${fileName}`);
            continue;
          }
          
          // Insert the image record
          const { error: insertError } = await supabase
            .from('article_images')
            .insert({
              article_id: article.id,
              imagekit_file_id: fileId,
              imagekit_url: imageUrl,
              file_name: fileName,
              is_used: true,
              is_featured_image: imageUrl === article.featured_image_url,
              folder_path: '/blog-articles/',
              created_at: new Date().toISOString()
            });
            
          if (insertError) {
            console.log(`    ❌ Failed to add ${fileName}:`, insertError.message);
          } else {
            console.log(`    ✅ Added: ${fileName}`);
            totalImagesAdded++;
          }
          
        } catch (error) {
          console.log(`    ❌ Error processing image ${imageUrl}:`, error.message);
        }
      }
    }
    
    console.log(`\n🎉 Backfill completed!`);
    console.log(`📊 Summary:`);
    console.log(`   Images found: ${totalImagesFound}`);
    console.log(`   Images added: ${totalImagesAdded}`);
    console.log(`   Skipped (duplicates): ${totalImagesFound - totalImagesAdded}`);
    
    if (totalImagesAdded > 0) {
      console.log(`\n✅ Visit /admin/images to see your tracked images!`);
    }
    
  } catch (error) {
    console.error('❌ Backfill failed:', error);
  }
}

// Helper function to convert string to base64 (simple hash for file IDs)
function btoa(str) {
  return Buffer.from(str).toString('base64');
}

backfillImageData();
