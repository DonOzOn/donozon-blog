#!/bin/bash

# Test script for image upload functionality
# This script tests both the storage bucket and API endpoints

echo "🧪 Testing Supabase Storage and Image Upload Functionality"
echo "======================================================="

# Set environment
cd ~/Desktop/donozonblog
source ~/.nvm/nvm.sh && nvm use

# Start the development server in background
echo "🚀 Starting development server..."
npm run dev &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 10

# Test the storage bucket policy
echo "📦 Testing storage bucket configuration..."
curl -s "https://xhzurxmliuvexekfilfo.supabase.co/storage/v1/bucket/article-images" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenVyeG1saXV2ZXhla2ZpbGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NDg3MTUsImV4cCI6MjA2NTAyNDcxNX0.iCAVfxShMlTnfgJAMSzQCM1BuquPxAzWGeI5RQCAB24" \
  -o /dev/null -w "Storage API Status: %{http_code}\n"

# Test the image upload API endpoint
echo "🖼️ Testing image upload API..."
curl -s "http://localhost:3000/api/upload/image" \
  -X OPTIONS \
  -o /dev/null -w "Upload API Status: %{http_code}\n"

# Check if admin pages are accessible
echo "🔐 Testing admin pages..."
curl -s "http://localhost:3000/admin/articles/new" \
  -o /dev/null -w "Admin New Article Page Status: %{http_code}\n"

# Stop the development server
echo "🛑 Stopping development server..."
kill $SERVER_PID 2>/dev/null || true

echo ""
echo "✅ Test completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Navigate to http://localhost:3000/admin/articles/new"
echo "3. Test the image upload functionality"
echo "4. Create a test article with a featured image"
echo ""
echo "🔍 Image Upload Flow:"
echo "• User selects/drops image in admin interface"
echo "• Image uploads to Supabase Storage (article-images bucket)"
echo "• API returns public URL"
echo "• URL is saved to articles.featured_image_url"
echo "• Alt text is saved to articles.featured_image_alt"