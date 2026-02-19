# Production Deployment Guide

## Firebase Hosting Environment Variables Setup

This app uses Firebase Hosting environment variables to securely manage configuration in production.

### Prerequisites

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Install Firebase Tools in Project**
   ```bash
   npm install --save-dev firebase-tools
   ```

### Step 1: Set Environment Variables

#### Option A: Using the Setup Script (Recommended)

1. **Set your environment variables** in your terminal or CI/CD:
   ```bash
   export FIREBASE_API_KEY="your_actual_api_key"
   export FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
   export FIREBASE_DATABASE_URL="https://your_project.firebaseio.com"
   export FIREBASE_PROJECT_ID="your_project_id"
   export FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
   export FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
   export FIREBASE_APP_ID="your_app_id"
   export FIREBASE_MEASUREMENT_ID="your_measurement_id"
   export FIREBASE_STORAGE_URL="https://firebasestorage.googleapis.com/v0/b/your_project.appspot.com/o/"
   ```

2. **Run the setup script**:
   ```bash
   npm run deploy:setup
   ```

#### Option B: Manual Setup

Set each variable individually:
```bash
firebase hosting:config:set env.VITE_FIREBASE_API_KEY="your_actual_api_key"
firebase hosting:config:set env.VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
firebase hosting:config:set env.VITE_FIREBASE_DATABASE_URL="https://your_project.firebaseio.com"
firebase hosting:config:set env.VITE_FIREBASE_PROJECT_ID="your_project_id"
firebase hosting:config:set env.VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
firebase hosting:config:set env.VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
firebase hosting:config:set env.VITE_FIREBASE_APP_ID="your_app_id"
firebase hosting:config:set env.VITE_FIREBASE_MEASUREMENT_ID="your_measurement_id"
firebase hosting:config:set env.VITE_FIREBASE_STORAGE_URL="https://firebasestorage.googleapis.com/v0/b/your_project.appspot.com/o/"
```

### Step 2: Build and Deploy

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to Firebase Hosting**:
   ```bash
   npm run deploy
   ```

### Step 3: Verify Deployment

1. **Check deployment status**:
   ```bash
   npm run deploy:check
   ```

2. **Test the live application**:
   - Visit your Firebase Hosting URL
   - Check browser console for errors
   - Verify images load correctly
   - Test all functionality

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `project.firebaseapp.com` |
| `VITE_FIREBASE_DATABASE_URL` | Firebase database URL | `https://project.firebaseio.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | `1:123:web:abc` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Analytics measurement ID | `G-XXXXXXXXXX` |
| `VITE_FIREBASE_STORAGE_URL` | Firebase storage URL | `https://firebasestorage.googleapis.com/v0/b/project.appspot.com/o/` |

### Troubleshooting

#### Build Fails with Missing Environment Variables

**Error**: `Missing required environment variables for production build`

**Solution**: Ensure all environment variables are set in Firebase Hosting:
```bash
firebase hosting:config:list
```

#### Images Not Loading in Production

**Symptoms**: Images show broken or don't load

**Solutions**:
1. Check `VITE_FIREBASE_STORAGE_URL` is set correctly
2. Verify Firebase Storage permissions
3. Check browser console for specific error messages

#### App Shows Configuration Error

**Symptoms**: "Configuration Error" message displayed

**Solutions**:
1. Verify all environment variables are set
2. Check Firebase project configuration
3. Ensure Firebase project is active

### CI/CD Integration

For automated deployments, set environment variables in your CI/CD system:

#### GitHub Actions Example
```yaml
- name: Deploy to Firebase
  run: |
    npm run build
    firebase deploy --only hosting
  env:
    FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
    FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
    # ... other variables
```

#### Vercel Example
Set environment variables in Vercel dashboard under Settings > Environment Variables.

### Security Best Practices

1. **Never commit actual API keys** to version control
2. **Use different keys** for development and production
3. **Regularly rotate** API keys
4. **Monitor usage** in Firebase console
5. **Restrict API key** usage to your domains only

### Multiple Environments

For staging/production environments:

1. **Create separate Firebase projects**
2. **Use different environment variable prefixes**:
   - Staging: `VITE_FIREBASE_API_KEY_STAGING`
   - Production: `VITE_FIREBASE_API_KEY`
3. **Update build scripts** to use appropriate variables

### Rollback Procedure

If deployment fails:

1. **Rollback to previous version**:
   ```bash
   firebase hosting:rollback
   ```

2. **Check environment variables**:
   ```bash
   firebase hosting:config:list
   ```

3. **Fix issues and redeploy**:
   ```bash
   npm run deploy
   ```

### Monitoring

Monitor your deployment:

1. **Firebase Console**: Check usage and errors
2. **Browser Console**: Look for client-side errors
3. **Network Tab**: Verify API calls are working
4. **Firebase Analytics**: Track user interactions

### Support

For issues:
1. Check Firebase Hosting documentation
2. Review Firebase Console for project issues
3. Verify environment variables are correctly set
4. Test build process locally first
