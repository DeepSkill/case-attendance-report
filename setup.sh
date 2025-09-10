#!/bin/bash

# Setup script for case-attendance-report
# This script ensures the project works correctly after cloning

set -e

echo "🚀 Setting up case-attendance-report..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Rebuild better-sqlite3 to ensure native bindings are correct
echo "🔧 Rebuilding better-sqlite3 native bindings..."
cd api
npm rebuild better-sqlite3
cd ..

# Verify database file exists
if [ ! -f "api/.tmp/data.db" ]; then
    echo "⚠️  Warning: Database file api/.tmp/data.db not found."
    echo "   The application will create a new database on first run."
else
    echo "✅ Database file found: api/.tmp/data.db"
fi

# Verify .env file exists
if [ ! -f "api/.env" ]; then
    echo "⚠️  Warning: .env file not found in api directory."
    echo "   Please copy api/.env.example to api/.env and configure it."
else
    echo "✅ Environment configuration found: api/.env"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server:"
echo "  pnpm dev"
echo ""
echo "To start only the API:"
echo "  pnpm --dir api develop"
echo ""
echo "To start only the web frontend:"
echo "  pnpm --dir web dev"
