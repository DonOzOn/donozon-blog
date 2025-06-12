#!/bin/bash

echo "🧪 Testing article API and category display..."

# Navigate to project directory
cd /Users/apple/Desktop/donozonblog

# Source zsh and use correct Node version
source ~/.zshrc
nvm use

echo "📦 Installing any missing dependencies..."
npm install

echo "🔧 Starting development server for testing..."
echo "📍 Server will start at http://localhost:3000"
echo "🔍 To test categories:"
echo "   1. Visit http://localhost:3000/admin/articles"
echo "   2. Check if categories display properly (not 'Uncategorized')"
echo "   3. Try creating a new article to test default author 'DonOzOn'"
echo ""
echo "🚀 Starting server..."

npm run dev
