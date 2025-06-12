#!/bin/bash

echo "🎯 Admin Panel Quick Test"
echo "========================"

# Function to check if port is in use
check_port() {
    lsof -ti:3000 >/dev/null 2>&1
}

# Check if server is running
if check_port; then
    echo "✅ Development server is already running on port 3000"
    echo ""
else
    echo "⚠️  Development server is not running"
    echo "Starting server..."
    echo ""
    
    cd /Users/apple/Desktop/donozonblog
    source ~/.nvm/nvm.sh && nvm use
    echo "🚀 Starting development server in background..."
    npm run dev > server.log 2>&1 &
    SERVER_PID=$!
    echo "Server PID: $SERVER_PID"
    
    # Wait for server to start
    echo "⏳ Waiting for server to start..."
    sleep 10
    
    if check_port; then
        echo "✅ Server started successfully!"
    else
        echo "❌ Server failed to start"
        echo "Check server.log for details"
        exit 1
    fi
fi

echo ""
echo "🌐 Admin Panel URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Admin:    http://localhost:3000/admin"
echo ""
echo "🔑 Admin Credentials:"
echo "   Username: admin"
echo "   Password: donozon2024"
echo ""

# Test API endpoints
echo "🧪 Testing API endpoints..."

echo "Testing admin articles API..."
curl -s http://localhost:3000/api/admin/articles > api_test.json
if [ -f api_test.json ]; then
    if grep -q "success" api_test.json; then
        echo "✅ Articles API is working"
        ARTICLE_COUNT=$(jq '.data | length' api_test.json 2>/dev/null || echo "unknown")
        echo "📊 Found $ARTICLE_COUNT articles"
    else
        echo "❌ Articles API returned error:"
        cat api_test.json
    fi
    rm -f api_test.json
else
    echo "❌ Could not test API - server may not be ready"
fi

echo ""
echo "🎯 Quick Actions to Test:"
echo "1. Go to admin dashboard"
echo "2. Click 'Create New Article' button"
echo "3. Click 'Manage Articles' button"
echo "4. Click 'Manage Categories' button"
echo "5. Verify all styling looks consistent"
echo ""
echo "📝 If you see issues:"
echo "   - Check server.log for errors"
echo "   - Verify .env.local has correct Supabase keys"
echo "   - Make sure database is accessible"
