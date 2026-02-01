#!/bin/bash

echo "🚀 I Just - Setup Script"
echo "========================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    echo ""
    echo "To install Node.js:"
    echo "1. Visit https://nodejs.org/"
    echo "2. Download and install the LTS version"
    echo "3. Or use Homebrew: brew install node"
    echo ""
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "🎉 You're ready to go! Run:"
    echo "   npm run dev"
    echo ""
    echo "Then open http://localhost:5173 in your browser"
else
    echo ""
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi
