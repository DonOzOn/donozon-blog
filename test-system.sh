#!/bin/bash

echo "🧪 Testing DonOzOn Blog Admin System..."
echo "=========================================="

# Check Node.js version
echo "📋 Node.js version:"
cd /Users/apple/Desktop/donozonblog
source ~/.nvm/nvm.sh && nvm use
node --version
npm --version
echo ""

# Check environment variables
echo "🔐 Environment check:"
if [ -f .env.local ]; then
    echo "✅ .env.local file exists"
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo "✅ NEXT_PUBLIC_SUPABASE_URL is set"
    else
        echo "❌ NEXT_PUBLIC_SUPABASE_URL is missing"
    fi
    if grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
        echo "✅ SUPABASE_SERVICE_ROLE_KEY is set"
    else
        echo "❌ SUPABASE_SERVICE_ROLE_KEY is missing"
    fi
else
    echo "❌ .env.local file not found"
fi
echo ""

# Check package.json scripts
echo "📦 Available scripts:"
node -e "
const pkg = require('./package.json');
Object.keys(pkg.scripts).forEach(script => {
    console.log('  ✓', script + ':', pkg.scripts[script]);
});
"
echo ""

# Test TypeScript compilation
echo "🔍 TypeScript check:"
npx tsc --noEmit --skipLibCheck
echo ""

# Try to build the project
echo "🏗️ Build test:"
npm run build > build.log 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed - check build.log for details"
    echo "Last few lines of build log:"
    tail -10 build.log
fi
echo ""

echo "🎯 Test completed!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start development server"
echo "2. Open http://localhost:3000 for the frontend"
echo "3. Open http://localhost:3000/admin for the admin panel"
echo "4. Admin credentials: admin / donozon2024"
