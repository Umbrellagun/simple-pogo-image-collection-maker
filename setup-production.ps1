# Production Setup Script for PoGo Collector (PowerShell)
# This script sets up Firebase Hosting environment variables and deploys the app

Write-Host "🚀 Setting up PoGo Collector for production deployment..." -ForegroundColor Green

# Check if Firebase CLI is installed
try {
    firebase --version | Out-Null
    Write-Host "✅ Firebase CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# Check if user is logged in to Firebase
Write-Host "🔐 Checking Firebase authentication..." -ForegroundColor Blue
try {
    firebase login --list | Out-Null
    Write-Host "✅ Firebase authentication found" -ForegroundColor Green
} catch {
    Write-Host "Please login to Firebase:" -ForegroundColor Yellow
    firebase login
}

# Get current environment variables from .env file
$envFile = ".env"
if (Test-Path $envFile) {
    Write-Host "📋 Reading environment variables from .env file..." -ForegroundColor Blue
    
    # Read and parse .env file
    $envContent = Get-Content $envFile
    $envVars = @{}
    
    foreach ($line in $envContent) {
        if ($line -match '^([^=]+)=(.*)$') {
            $envVars[$matches[1]] = $matches[2]
        }
    }
    
    Write-Host "⚙️ Setting Firebase Hosting environment variables..." -ForegroundColor Blue
    
    # Set environment variables in Firebase Hosting
    firebase hosting:config:set env.VITE_FIREBASE_API_KEY="$($envVars['VITE_FIREBASE_API_KEY'])"
    firebase hosting:config:set env.VITE_FIREBASE_AUTH_DOMAIN="$($envVars['VITE_FIREBASE_AUTH_DOMAIN'])"
    firebase hosting:config:set env.VITE_FIREBASE_DATABASE_URL="$($envVars['VITE_FIREBASE_DATABASE_URL'])"
    firebase hosting:config:set env.VITE_FIREBASE_PROJECT_ID="$($envVars['VITE_FIREBASE_PROJECT_ID'])"
    firebase hosting:config:set env.VITE_FIREBASE_STORAGE_BUCKET="$($envVars['VITE_FIREBASE_STORAGE_BUCKET'])"
    firebase hosting:config:set env.VITE_FIREBASE_MESSAGING_SENDER_ID="$($envVars['VITE_FIREBASE_MESSAGING_SENDER_ID'])"
    firebase hosting:config:set env.VITE_FIREBASE_APP_ID="$($envVars['VITE_FIREBASE_APP_ID'])"
    firebase hosting:config:set env.VITE_FIREBASE_MEASUREMENT_ID="$($envVars['VITE_FIREBASE_MEASUREMENT_ID'])"
    firebase hosting:config:set env.VITE_FIREBASE_STORAGE_URL="$($envVars['VITE_FIREBASE_STORAGE_URL'])"
    
    Write-Host "✅ Environment variables configured!" -ForegroundColor Green
    
} else {
    Write-Host "❌ .env file not found. Please create it with your Firebase configuration." -ForegroundColor Red
    exit 1
}

# Build the application
Write-Host "🔨 Building application for production..." -ForegroundColor Blue
$buildResult = npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    # Deploy to Firebase Hosting
    Write-Host "🚀 Deploying to Firebase Hosting..." -ForegroundColor Blue
    firebase deploy --only hosting
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 Deployment successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Next steps:" -ForegroundColor Cyan
        Write-Host "1. Test your live application"
        Write-Host "2. Check browser console for any errors"
        Write-Host "3. Verify images load correctly"
        Write-Host ""
        Write-Host "🔗 To check deployment status: npm run deploy:check" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
