import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'

// Read package.json to get version
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  // Validate required environment variables in production
  if (mode === 'production') {
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_APP_ID',
      'VITE_FIREBASE_STORAGE_URL'
    ]
    
    const missingVars = requiredVars.filter(varName => !env[varName])
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables for production build:')
      missingVars.forEach(varName => console.error(`   - ${varName}`))
      console.error('\n💡 Set these variables using Firebase CLI:')
      console.error('   firebase hosting:config:set env.VITE_FIREBASE_API_KEY="your_key"')
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
    }
    
    console.log('✅ All required environment variables found for production build')
  }
  
  return {
    plugins: [react()],
    define: {
      'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version)
    },
    resolve: {
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
    },
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'build'
    }
  }
})
