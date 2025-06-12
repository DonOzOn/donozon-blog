#!/bin/bash

echo "📝 Creating Sample Articles for Testing"
echo "======================================="

cd /Users/apple/Desktop/donozonblog

# Check if server is running
if ! lsof -ti:3000 >/dev/null 2>&1; then
    echo "❌ Development server is not running on port 3000"
    echo "Please start the server first with: npm run dev"
    exit 1
fi

echo "✅ Server is running, creating sample articles..."

# Sample article data
cat > sample_article.json << EOF
{
  "title": "Getting Started with Next.js 15",
  "slug": "getting-started-nextjs-15",
  "excerpt": "Learn how to build modern web applications with Next.js 15, featuring the latest App Router and React Server Components.",
  "content": "# Getting Started with Next.js 15\n\nNext.js 15 introduces powerful new features that make building web applications easier than ever. In this comprehensive guide, we'll explore the latest features and how to use them effectively.\n\n## Key Features\n\n- **App Router**: The new file-system based router\n- **React Server Components**: Better performance and SEO\n- **Improved TypeScript Support**: Enhanced developer experience\n\n## Installation\n\n\`\`\`bash\nnpx create-next-app@latest my-app\ncd my-app\nnpm run dev\n\`\`\`\n\n## Conclusion\n\nNext.js 15 is a powerful framework that simplifies modern web development while providing excellent performance and developer experience.",
  "status": "published",
  "is_featured": true,
  "reading_time": 5,
  "meta_title": "Getting Started with Next.js 15 - Complete Guide",
  "meta_description": "Learn Next.js 15 from scratch with this comprehensive guide covering App Router, Server Components, and more."
}
EOF

# Create the article
echo "🚀 Creating sample article..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/admin/articles \
  -H "Content-Type: application/json" \
  -d @sample_article.json)

echo "📄 API Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

# Clean up
rm -f sample_article.json

# Check if it was successful
if echo "$RESPONSE" | grep -q "success"; then
    echo ""
    echo "✅ Sample article created successfully!"
    echo "🎯 Now test the admin dashboard:"
    echo "   1. Go to http://localhost:3000/admin/dashboard"
    echo "   2. You should see 1 article in the statistics"
    echo "   3. Go to http://localhost:3000/admin/articles to see the article"
else
    echo ""
    echo "❌ Failed to create sample article"
    echo "This might be due to:"
    echo "   - Database connection issues"
    echo "   - Missing environment variables"
    echo "   - Supabase configuration problems"
fi

echo ""
echo "🔍 You can also test manually by:"
echo "   1. Going to http://localhost:3000/admin/articles/new"
echo "   2. Creating a new article through the UI"
