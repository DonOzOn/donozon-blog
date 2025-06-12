#!/bin/bash

echo "🚀 Starting DonOzOn Blog Development Server..."
echo "📋 Setting up Node.js environment..."

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use correct Node version from .nvmrc
nvm use

echo "✅ Node.js version: $(node --version)"
echo "📦 npm version: $(npm --version)"
echo ""
echo "🌐 Starting development server..."
echo "📍 Admin panel will be available at: http://localhost:3000/admin"
echo "🔑 Login credentials: admin / donozon2024"
echo ""

# Start the development server
npm run dev