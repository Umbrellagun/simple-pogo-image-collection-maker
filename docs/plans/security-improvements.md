---
description: Implement security improvements to address vulnerabilities and enhance app security
---

# Security Improvements Plan

## Overview
Address medium and low security concerns identified in the PoGo Collector app to enhance overall security posture and follow best practices.

## Security Issues Identified

### Medium Priority Issues
1. **URL Parameter Injection Risk** - No validation of shared collection URL parameters
2. **Hardcoded External Domain** - Sharing URL uses hardcoded `pogocollector.com` domain

### Low Priority Issues  
3. **Global Variable Usage** - Firebase storage exposed on `window` object
4. **External Domain Configuration** - Make external dependencies configurable
5. **DDoS Protection Gaps** - No rate limiting on Firebase Storage requests
6. **Resource Exhaustion** - No limits on collection sizes or request frequency

## Implementation Plan

### Phase 1: Input Validation (High Impact)

#### 1.1 Validate URL Parameters
**File**: `src/js/HomePage.jsx` (lines 99-112)

**Current Code**:
```javascript
useEffect(() => {
  const query = queryString.parse(location.search);
  if (query.collection_name) {
    const currentPokemon = {};
    query.pokemon.split(",").forEach((pokemonId) => {
      currentPokemon[pokemonId] = pokemonId;
    });
    // ... rest of code
  }
}, [location.search]);
```

**Improved Code**:
```javascript
const validatePokemonId = (id) => {
  // Pokemon IDs should be numeric strings between 1-999
  return /^\d{1,3}$/.test(id) && parseInt(id) >= 1 && parseInt(id) <= 999;
};

const validateCollectionName = (name) => {
  // Collection names should be reasonable length and safe characters
  return typeof name === 'string' && 
         name.length > 0 && 
         name.length <= 50 && 
         /^[a-zA-Z0-9\s\-_]+$/.test(name);
};

useEffect(() => {
  const query = queryString.parse(location.search);
  if (query.collection_name && validateCollectionName(query.collection_name)) {
    if (query.pokemon && typeof query.pokemon === 'string') {
      const currentPokemon = {};
      const pokemonIds = query.pokemon.split(",");
      
      // Validate each Pokemon ID
      const validIds = pokemonIds.filter(validatePokemonId);
      
      if (validIds.length > 0 && validIds.length <= 200) { // Reasonable limit
        validIds.forEach((pokemonId) => {
          currentPokemon[pokemonId] = pokemonId;
        });
        
        setPanel("shared_collection");
        setSharedCollection({
          name: query.collection_name,
          pokemon_ids: currentPokemon
        });
      }
    }
  }
}, [location.search]);
```

#### 1.2 Add Error Boundaries
**File**: `src/js/components/ErrorBoundary.jsx` (new file)

```javascript
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page and try again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Phase 2: Configuration Management (Medium Impact)

#### 2.1 Make External Domain Configurable
**File**: `src/js/hooks/useCollections.js` (line 86)

**Current Code**:
```javascript
let url = `https://pogocollector.com/?collection_name=${collection.name.replace(/ /g, "%20")}&pokemon=`;
```

**Improved Code**:
```javascript
const getSharingUrl = useCallback((collectionId) => {
  const collection = collections[collectionId];
  if (!collection) return "";

  const baseUrl = import.meta.env.VITE_SHARING_BASE_URL || 'https://pogocollector.com';
  let url = `${baseUrl}/?collection_name=${encodeURIComponent(collection.name)}&pokemon=`;

  Object.keys(collection.pokemon_ids).forEach((id, key) => {
    const comma = key !== 0 ? "," : "";
    url = `${url}${comma}${id}`;
  });

  return url;
}, [collections]);
```

#### 2.2 Update Environment Variables
**File**: `.env.example`

Add new variable:
```
VITE_SHARING_BASE_URL=https://pogocollector.com
```

### Phase 3: Remove Global Variables (Low Impact)

#### 3.1 Create Firebase Context
**File**: `src/js/context/FirebaseContext.jsx` (new file)

```javascript
import React, { createContext, useContext } from 'react';

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children, storage }) => (
  <FirebaseContext.Provider value={storage}>
    {children}
  </FirebaseContext.Provider>
);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
```

#### 3.2 Update Main Entry Point
**File**: `src/main.jsx`

```javascript
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

import HomePage from "./js/HomePage.jsx";
import { FirebaseProvider } from "./js/context/FirebaseContext.jsx";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const storage = ref(getStorage(app));

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <FirebaseProvider storage={storage}>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  </FirebaseProvider>
);
```

#### 3.3 Update usePokemon Hook
**File**: `src/js/hooks/usePokemon.js`

```javascript
import { useState, useEffect, useCallback } from "react";
import { listAll } from "firebase/storage";
import { useFirebase } from "../context/FirebaseContext.jsx";
import useLocalStorage from "./useLocalStorage.js";
import image_parser from "../image_parser.js";

const usePokemon = (currentVersion) => {
  const [pokemon, setPokemon] = useLocalStorage("pokemon", []);
  const [version, setVersion] = useLocalStorage("version", null);
  const [loading, setLoading] = useState(true);
  const storage = useFirebase();

  const fetchPokemon = useCallback(async () => {
    try {
      const res = await listAll(storage);
      const updatedPokemon = res.items.map((image) => 
        image_parser(image.fullPath)
      );
      setPokemon(updatedPokemon);
      setVersion(currentVersion);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pokemon:", error);
      setLoading(false);
    }
  }, [currentVersion, setPokemon, setVersion, storage]);

  // ... rest of hook remains the same
};

export default usePokemon;
```

### Phase 4: Additional Security Enhancements

#### 4.1 Add Content Security Policy Headers
**File**: `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "img-src 'self' https://firebasestorage.googleapis.com",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "connect-src 'self' https://firebasestorage.googleapis.com",
        "font-src 'self' data:"
      ].join('; ')
    }
  },
  build: {
    outDir: 'build'
  }
})
```

#### 4.2 Add Rate Limiting for Collection Sharing
**File**: `src/js/hooks/useCollections.js`

```javascript
const getSharingUrl = useCallback((collectionId) => {
  const collection = collections[collectionId];
  if (!collection) return "";

  // Prevent sharing collections with too many Pokemon
  const pokemonCount = Object.keys(collection.pokemon_ids).length;
  if (pokemonCount > 200) {
    console.warn('Collection too large to share');
    return "";
  }

  const baseUrl = import.meta.env.VITE_SHARING_BASE_URL || 'https://pogocollector.com';
  let url = `${baseUrl}/?collection_name=${encodeURIComponent(collection.name)}&pokemon=`;

  Object.keys(collection.pokemon_ids).forEach((id, key) => {
    const comma = key !== 0 ? "," : "";
    url = `${url}${comma}${id}`;
  });

  return url;
}, [collections]);
```

### Phase 5: DDoS Protection & Rate Limiting (Medium Impact)

#### 5.1 Client-Side Rate Limiting
**File**: `src/js/hooks/usePokemon.js`

**Current Code**:
```javascript
const fetchPokemon = useCallback(async () => {
  try {
    const res = await listAll(window.storage);
    // ... rest of code
  } catch (error) {
    console.error("Error fetching pokemon:", error);
    setLoading(false);
  }
}, [currentVersion, setPokemon, setVersion]);
```

**Improved Code**:
```javascript
const usePokemon = (currentVersion) => {
  const [pokemon, setPokemon] = useLocalStorage("pokemon", []);
  const [version, setVersion] = useLocalStorage("version", null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(0);
  
  // Rate limiting: minimum 5 seconds between requests
  const MIN_FETCH_INTERVAL = 5000;

  const fetchPokemon = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetch < MIN_FETCH_INTERVAL) {
      console.warn('Rate limit: Please wait before fetching again');
      return;
    }

    try {
      setLastFetch(now);
      const res = await listAll(window.storage);
      const updatedPokemon = res.items.map((image) => 
        image_parser(image.fullPath)
      );
      setPokemon(updatedPokemon);
      setVersion(currentVersion);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pokemon:", error);
      setLoading(false);
    }
  }, [currentVersion, setPokemon, setVersion, lastFetch]);

  // ... rest of hook
};
```

#### 5.2 Request Debouncing
**File**: `src/js/hooks/useRequestDebounce.js` (new file)

```javascript
import { useCallback, useRef } from 'react';

export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};
```

#### 5.3 Resource Limits Implementation
**File**: `src/js/hooks/useCollections.js`

**Add to existing getSharingUrl function**:
```javascript
const getSharingUrl = useCallback((collectionId) => {
  const collection = collections[collectionId];
  if (!collection) return "";

  // Prevent sharing collections with too many Pokemon
  const pokemonCount = Object.keys(collection.pokemon_ids).length;
  if (pokemonCount > 200) {
    console.warn('Collection too large to share');
    return "";
  }

  // Validate URL length to prevent excessively long URLs
  const baseUrl = import.meta.env.VITE_SHARING_BASE_URL || 'https://pogocollector.com';
  let url = `${baseUrl}/?collection_name=${encodeURIComponent(collection.name)}&pokemon=`;

  Object.keys(collection.pokemon_ids).forEach((id, key) => {
    const comma = key !== 0 ? "," : "";
    url = `${url}${comma}${id}`;
    
    // Check if URL is getting too long
    if (url.length > 2000) {
      console.warn('URL too long, truncating');
      return false;
    }
  });

  return url;
}, [collections]);
```

#### 5.4 Request Monitoring Hook
**File**: `src/js/hooks/useRequestMonitor.js` (new file)

```javascript
import { useState, useCallback } from 'react';

export const useRequestMonitor = (maxRequests = 100, blockDuration = 60000) => {
  const [requestCount, setRequestCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const trackRequest = useCallback(() => {
    if (isBlocked) {
      return false; // Request blocked
    }

    setRequestCount(prev => {
      const newCount = prev + 1;
      
      // Block if too many requests
      if (newCount > maxRequests) {
        setIsBlocked(true);
        setTimeout(() => {
          setIsBlocked(false);
          setRequestCount(0);
        }, blockDuration);
        
        return newCount;
      }
      
      return newCount;
    });

    return true; // Request allowed
  }, [isBlocked, maxRequests, blockDuration]);

  const resetCount = useCallback(() => {
    setRequestCount(0);
    setIsBlocked(false);
  }, []);

  return { 
    requestCount, 
    isBlocked, 
    trackRequest, 
    resetCount 
  };
};
```

#### 5.5 Firebase Security Rules
**File**: `firebase.storage.rules` (new file)

```json
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /pokemon_images/{allPaths=**} {
      allow read: if true; // Public read access for images
      allow write: if false; // No public write access
      
      // Prevent hotlinking and abuse
      allow read: if 
        request.time < timestamp.date(2025, 1, 1) || // Temporary rule
        request.headers['x-forwarded-for'] != null;
    }
    
    // Prevent listing of entire bucket
    match /{allPaths=**} {
      allow list: if false;
    }
  }
}
```

#### 5.6 Enhanced Firebase Hosting Configuration
**File**: `firebase.json`

**Update existing configuration**:
```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          },
          {
            "key": "Permissions-Policy",
            "value": "geolocation=(), microphone=(), camera=()"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### 5.7 Enhanced Lazy Loading
**File**: `src/js/components/EnhancedLazyImage.jsx` (new file)

```javascript
import React, { useState, useEffect, useRef } from 'react';

const EnhancedLazyImage = ({ src, alt, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before visible
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div ref={imgRef} className={className} {...props}>
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
      {hasError && (
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: '#666'
        }}>
          Image unavailable
        </div>
      )}
    </div>
  );
};

export default EnhancedLazyImage;
```

## Testing & Validation

### Security Testing Checklist
- [ ] Test with malicious URL parameters
- [ ] Test with extremely long collection names
- [ ] Test with invalid Pokemon IDs
- [ ] Test with large collections (>200 Pokemon)
- [ ] Verify CSP headers are working
- [ ] Test error boundaries with various failures
- [ ] Verify no global variables exposed
- [ ] Test rate limiting with rapid requests
- [ ] Test request monitoring and blocking
- [ ] Verify Firebase security rules are enforced
- [ ] Test enhanced lazy loading performance
- [ ] Verify resource limits prevent abuse
- [ ] Test URL length validation
- [ ] Verify Firebase hosting headers are applied

### Performance Testing
- [ ] Verify input validation doesn't impact performance
- [ ] Test error boundary overhead
- [ ] Validate Firebase Context performance
- [ ] Test rate limiting impact on user experience
- [ ] Validate lazy loading reduces bandwidth usage
- [ ] Test request monitoring overhead

## Expected Benefits

### Security Improvements
- **Input Validation**: Prevents crashes and potential injection
- **Error Boundaries**: Graceful failure handling
- **Configurable Domains**: Reduces external dependencies
- **No Global Variables**: Cleaner, more secure code
- **CSP Headers**: Additional layer of protection
- **Rate Limiting**: Prevents abuse and resource exhaustion
- **Request Monitoring**: Detects and blocks suspicious activity
- **Resource Limits**: Prevents large-scale abuse
- **Enhanced Lazy Loading**: Reduces bandwidth and improves performance
- **Firebase Security Rules**: Server-side protection for storage

### Code Quality
- **Better Error Handling**: More robust user experience
- **Maintainability**: Easier to configure and extend
- **Best Practices**: Follows React security guidelines

## Estimated Time
- **Phase 1**: 2-3 hours (Input validation & error boundaries)
- **Phase 2**: 1-2 hours (Configuration management)
- **Phase 3**: 2-3 hours (Firebase context implementation)
- **Phase 4**: 1-2 hours (Additional enhancements)
- **Phase 5**: 3-4 hours (DDoS protection & rate limiting)
- **Testing**: 2-3 hours

**Total: 11-17 hours**

## Risk Assessment
- **Low Risk**: All changes are backward compatible
- **Rollback**: Each phase can be implemented independently
- **Testing**: Comprehensive test coverage recommended

## Success Criteria
- [ ] All URL parameters properly validated
- [ ] No global variables exposed
- [ ] External domains configurable
- [ ] Error boundaries prevent crashes
- [ ] CSP headers implemented
- [ ] Rate limiting prevents abuse
- [ ] Resource limits enforced
- [ ] Request monitoring functional
- [ ] Firebase security rules active
- [ ] Enhanced lazy loading working
- [ ] All security tests pass

## Implementation Checklist

### Phase 1: Input Validation (High Impact)
- [ ] Create validation functions for Pokemon IDs
- [ ] Create validation functions for collection names
- [ ] Update HomePage.jsx with URL parameter validation
- [ ] Add error handling for invalid parameters
- [ ] Test validation with malicious inputs
- [ ] Create ErrorBoundary component
- [ ] Wrap components with ErrorBoundary
- [ ] Test error boundary functionality

### Phase 2: Configuration Management (Medium Impact)
- [ ] Create config.js utility file
- [ ] Add VITE_SHARING_BASE_URL to .env
- [ ] Update .env.example with new variable
- [ ] Modify useCollections.js to use configurable domain
- [ ] Test configuration changes
- [ ] Update deployment scripts for new environment variables

### Phase 3: Firebase Context Implementation (Medium Impact)
- [ ] Create FirebaseContext provider
- [ ] Remove window.storage global variable
- [ ] Update main.jsx to use context
- [ ] Update usePokemon.js to use context
- [ ] Test Firebase functionality without globals
- [ ] Verify all Firebase operations work correctly

### Phase 4: Additional Enhancements (Low Impact)
- [ ] Create CSP headers configuration
- [ ] Update firebase.json with security headers
- [ ] Test CSP headers in browser
- [ ] Verify no console errors from CSP
- [ ] Test all functionality with CSP active

### Phase 5: DDoS Protection & Rate Limiting (Medium Impact)
- [ ] Update usePokemon.js with rate limiting
- [ ] Create useRequestDebounce.js hook
- [ ] Update useCollections.js with resource limits
- [ ] Create useRequestMonitor.js hook
- [ ] Create firebase.storage.rules file
- [ ] Update firebase.json with enhanced headers
- [ ] Create EnhancedLazyImage.jsx component
- [ ] Test rate limiting functionality
- [ ] Test resource limits enforcement
- [ ] Verify Firebase security rules work
- [ ] Test enhanced lazy loading

### Deployment & Testing
- [ ] Build application with all security changes
- [ ] Deploy to staging environment
- [ ] Run security testing checklist
- [ ] Run performance testing checklist
- [ ] Verify all security tests pass
- [ ] Deploy to production
- [ ] Monitor production for issues

### Documentation & Maintenance
- [ ] Update README with security features
- [ ] Document security configuration
- [ ] Create security monitoring procedures
- [ ] Document rollback procedures
- [ ] Train team on security best practices
