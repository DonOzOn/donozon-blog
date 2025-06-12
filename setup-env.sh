#!/bin/bash

# Setup script for Donozon Blog
# This script ensures you're using the correct Node.js version

echo "🚀 Setting up Donozon Blog environment..."

# Load nvm
if [ -f ~/.nvm/nvm.sh ]; then
    source ~/.nvm/nvm.sh
    echo "✅ NVM loaded"
else
    echo "❌ NVM not found. Please install NVM first."
    exit 1
fi

# Use the correct Node.js version
if [ -f .nvmrc ]; then
    echo "📦 Using Node.js version specified in .nvmrc..."
    nvm use
else
    echo "📦 Using latest LTS Node.js version..."
    nvm use --lts
fi

# Display current versions
echo "🔍 Current versions:"
echo "   Node.js: $(node --version)"
echo "   npm: $(npm --version)"

echo "✨ Environment setup complete!"
echo ""
echo "💡 Available commands:"
echo "   npm run dev     - Start development server"
echo "   npm run build   - Build for production"
echo "   npm run start   - Start production server"
echo "   npm run lint    - Run linting"
