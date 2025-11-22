#!/bin/bash
# Deployment Package Script (Linux/Mac)
# This script creates a clean deployment package without node_modules

echo "🚀 Creating deployment package..."

# Create temp directory for package
PACKAGE_DIR="letsgrow-deploy"
rm -rf $PACKAGE_DIR
mkdir -p $PACKAGE_DIR

# Files and folders to include
INCLUDES=(
    "app"
    "components"
    "lib"
    "prisma"
    "public"
    "package.json"
    "package-lock.json"
    "next.config.js"
    "tsconfig.json"
    "tailwind.config.ts"
    "postcss.config.js"
    "server.js"
    "vercel.json"
    ".htaccess"
    "env.production.example"
)

# Copy files
echo "📁 Copying files..."
for item in "${INCLUDES[@]}"; do
    if [ -e "$item" ]; then
        cp -r "$item" "$PACKAGE_DIR/"
        echo "  ✓ Copied $item"
    else
        echo "  ⚠ Skipped $item (not found)"
    fi
done

# Create ZIP
echo ""
echo "📦 Creating ZIP file..."
ZIP_FILE="letsgrow-deploy.zip"
rm -f $ZIP_FILE
cd $PACKAGE_DIR
zip -r ../$ZIP_FILE . -q
cd ..

# Get file size
SIZE=$(du -h $ZIP_FILE | cut -f1)
echo ""
echo "✅ Package created successfully!"
echo "📦 File: $ZIP_FILE"
echo "📊 Size: $SIZE"

# Cleanup
rm -rf $PACKAGE_DIR

echo ""
echo "📋 What's included:"
echo "  • Application code (app, components, lib)"
echo "  • Database schema (prisma)"
echo "  • Public assets (public)"
echo "  • Configuration files"
echo "  • Server file for cPanel"
echo "  • Installation wizard"

echo ""
echo "⚠️  NOT included (will be installed on server):"
echo "  • node_modules (too large)"
echo "  • .next build folder (will be built on server)"
echo "  • .env files (will be created by installer)"

echo ""
echo "🚀 Next steps:"
echo "  1. Upload $ZIP_FILE to your server"
echo "  2. Extract the ZIP file"
echo "  3. Visit https://yourdomain.com/install"
echo "  4. Follow the installation wizard"
