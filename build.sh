#!/bin/bash
# Render deployment script
echo "🎬 Building React-Python Movies Application..."

# Build frontend
cd ui
npm ci
npm run build
cd ..

# Copy built frontend to api folder for serving
cp -r ui/build api/

# Install Python dependencies
cd api
pip install -r requirements.txt
cd ..

echo "✅ Build complete!"
