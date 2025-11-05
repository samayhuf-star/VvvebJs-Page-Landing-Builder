#!/bin/bash

# Quick Deployment Script for Modern Page Builder
# This script helps deploy to Vercel

echo "🚀 Modern Page Builder - Vercel Deployment Helper"
echo "=================================================="
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "📝 To deploy, you need a valid Vercel token."
echo ""
echo "How to get a Vercel token:"
echo "1. Go to https://vercel.com/account/tokens"
echo "2. Click 'Create Token'"
echo "3. Give it a name (e.g., 'Modern Builder Deploy')"
echo "4. Set expiration (recommend 'No Expiration' or 1 year)"
echo "5. Click 'Create'"
echo "6. Copy the token (you'll only see it once!)"
echo ""
echo "Then run this command:"
echo "  vercel --token YOUR_TOKEN_HERE --yes --prod"
echo ""
echo "Or use the simpler method:"
echo "=================================================="
echo "🌐 Deploy via Web Interface (EASIEST):"
echo "1. Go to: https://vercel.com/new"
echo "2. Import from: https://github.com/samayhuf-star/VvvebJs-Page-Landing-Builder"
echo "3. Select branch: claude/page-builder-drag-drop-011CUpLoPpa1pCZy2qSx1huS"
echo "4. Click Deploy"
echo "5. Done! 🎉"
echo ""
