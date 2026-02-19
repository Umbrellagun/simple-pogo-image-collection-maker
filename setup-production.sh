#!/bin/bash

# Production Setup Script for PoGo Collector
# This script sets up Firebase Hosting environment variables and deploys the app

echo "🚀 Setting up PoGo Collector for production deployment..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if user is logged in to Firebase
echo "🔐 Checking Firebase authentication..."
if ! firebase login --list &> /dev/null; then
    echo "Please login to Firebase:"
    firebase login
fi

# Get current environment variables from .env file
if [ -f ".env" ]; then
    echo "📋 Reading environment variables from .env file..."
    
    # Extract variables from .env file
    API_KEY=$(grep VITE_FIREBASE_API_KEY .env | cut -d '=' -f2)
    AUTH_DOMAIN=$(grep VITE_FIREBASE_AUTH_DOMAIN .env | cut -d '=' -f2)
    DATABASE_URL=$(grep VITE_FIREBASE_DATABASE_URL .env | cut -d '=' -f2)
    PROJECT_ID=$(grep VITE_FIREBASE_PROJECT_ID .env | cut -d '=' -f2)
    STORAGE_BUCKET=$(grep VITE_FIREBASE_STORAGE_BUCKET .env | cut -d '=' -f2)
    MESSAGING_SENDER_ID=$(grep VITE_FIREBASE_MESSAGING_SENDER_ID .env | cut -d '=' -f2)
    APP_ID=$(grep VITE_FIREBASE_APP_ID .env | cut -d '=' -f2)
    MEASUREMENT_ID=$(grep VITE_FIREBASE_MEASUREMENT_ID .env | cut -d '=' -f2)
    STORAGE_URL=$(grep VITE_FIREBASE_STORAGE_URL .env | cut -d '=' -f2)
    
    echo "⚙️ Setting Firebase Hosting environment variables..."
    
    # Set environment variables in Firebase Hosting
    firebase hosting:config:set env.VITE_FIREBASE_API_KEY="$API_KEY"
    firebase hosting:config:set env.VITE_FIREBASE_AUTH_DOMAIN="$AUTH_DOMAIN"
    firebase hosting:config:set env.VITE_FIREBASE_DATABASE_URL="$DATABASE_URL"
    firebase hosting:config:set env.VITE_FIREBASE_PROJECT_ID="$PROJECT_ID"
    firebase hosting:config:set env.VITE_FIREBASE_STORAGE_BUCKET="$STORAGE_BUCKET"
    firebase hosting:config:set env.VITE_FIREBASE_MESSAGING_SENDER_ID="$MESSAGING_SENDER_ID"
    firebase hosting:config:set env.VITE_FIREBASE_APP_ID="$APP_ID"
    firebase hosting:config:set env.VITE_FIREBASE_MEASUREMENT_ID="$MEASUREMENT_ID"
    firebase hosting:config:set env.VITE_FIREBASE_STORAGE_URL="$STORAGE_URL"
    
    echo "✅ Environment variables configured!"
    
else
    echo "❌ .env file not found. Please create it with your Firebase configuration."
    exit 1
fi

# Build the application
echo "🔨 Building application for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Firebase Hosting
    echo "🚀 Deploying to Firebase Hosting..."
    firebase deploy --only hosting
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo ""
        echo "📋 Next steps:"
        echo "1. Test your live application"
        echo "2. Check browser console for any errors"
        echo "3. Verify images load correctly"
        echo ""
        echo "🔗 To check deployment status: npm run deploy:check"
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
