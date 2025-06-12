#!/bin/bash

# Setup Node.js for Donozon Blog
echo "🚀 Setting up Node.js for Donozon Blog..."

# Source zsh configuration to load nvm
source ~/.zshrc

# Check if nvm is available
if ! command -v nvm &> /dev/null; then
    echo "❌ nvm is not installed. Please install nvm first."
    exit 1
fi

# Use the version specified in .nvmrc
echo "📦 Using Node.js version from .nvmrc..."
nvm use

# Verify the Node version
echo "✅ Current Node.js version: $(node --version)"
echo "✅ Current npm version: $(npm --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo "🎉 Setup complete! You can now run:"
echo "  npm run dev    # Start development server"
echo "  npm run build  # Build for production"
echo "  npm run lint   # Run linting"
