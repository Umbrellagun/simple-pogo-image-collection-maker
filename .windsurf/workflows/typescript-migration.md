---
description: Migrate the PoGo Collector app from JavaScript to TypeScript
---

# TypeScript Migration Plan

## Overview
Convert the PoGo Collector React app from JavaScript to TypeScript to improve type safety, developer experience, and code maintainability.

## Prerequisites
- Current app is fully functional with Vite + React 18
- All components are modular and well-structured
- Firebase v10 and modern React patterns are in place

## Migration Steps

### Phase 1: Setup TypeScript Configuration
1. Install TypeScript dependencies
2. Create `tsconfig.json` with appropriate configuration
3. Update `vite.config.js` to handle TypeScript
4. Rename entry point from `main.jsx` to `main.tsx`

### Phase 2: Type Definitions
1. Create type definitions for:
   - Pokemon data structure
   - Collection interface
   - Filter options
   - Component props
2. Install type definitions for external libraries:
   - `@types/react`
   - `@types/react-dom`
   - `@types/react-modal`
   - Firebase types (built-in)

### Phase 3: Core Utilities (Low Risk)
1. Convert `image_parser.js` → `image_parser.ts`
   - Add return type for parsed Pokemon data
   - Type input parameters
2. Convert `styles.js` → `styles.ts`
   - Add proper CSSProperties types
3. Convert data files:
   - `live-shinys.js` → `live-shinys.ts`
   - `non-live-pokemon.js` → `non-live-pokemon.ts`

### Phase 4: Custom Hooks
1. Convert `useLocalStorage.js` → `useLocalStorage.ts`
   - Generic types for different data types
   - Proper return typing
2. Convert `usePokemon.js` → `usePokemon.ts`
   - Pokemon interface types
   - Firebase storage types
3. Convert `useFilters.js` → `useFilters.ts`
   - Filter state types
   - Options interface
4. Convert `useCollections.js` → `useCollections.ts`
   - Collection interface
   - Collection management types

### Phase 5: Components (Medium Risk)
1. Convert `Icons.jsx` → `Icons.tsx`
   - Simple component, good starting point
2. Convert `Pokemon.jsx` → `Pokemon.tsx`
   - Props interface
   - Event handler types
3. Convert `FilterPanel.jsx` → `FilterPanel.tsx`
   - Filter props interface
4. Convert modal components:
   - `DeleteCollectionModal.jsx` → `DeleteCollectionModal.tsx`
   - `ShareCollectionModal.jsx` → `ShareCollectionModal.tsx`
5. Convert menu components:
   - `AboutMenu.jsx` → `AboutMenu.tsx`
   - `FeaturesMenu.jsx` → `FeaturesMenu.tsx`
   - `ContactMenu.jsx` → `ContactMenu.tsx`
   - `MoreMenu.jsx` → `MoreMenu.tsx`
6. Convert `CollectionDropdown.jsx` → `CollectionDropdown.tsx`

### Phase 6: Main Component (High Risk)
1. Convert `HomePage.jsx` → `HomePage.tsx`
   - Complex state management
   - Multiple hook integrations
   - Event handler types
2. Update `main.tsx` with proper types
3. Update `index.html` script reference

### Phase 7: Firebase Integration
1. Add proper Firebase configuration types
2. Type Firebase storage references
3. Add error handling types

### Phase 8: Testing & Validation
1. Run TypeScript compiler to check for errors
2. Test all functionality works identically
3. Fix any type issues that arise
4. Ensure build process works correctly

## Expected Benefits
- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Improved autocomplete and refactoring
- **Self-Documenting Code**: Types serve as documentation
- **Easier Maintenance**: Clear interfaces and contracts
- **Better Developer Experience**: Fewer runtime errors

## Estimated Time
- **Phase 1-2**: 1-2 hours (setup)
- **Phase 3-4**: 2-3 hours (utilities and hooks)
- **Phase 5**: 3-4 hours (components)
- **Phase 6**: 2-3 hours (main component)
- **Phase 7-8**: 1-2 hours (Firebase and testing)

**Total: 9-14 hours**

## Risk Assessment
- **Low Risk**: Utility files, simple components
- **Medium Risk**: Custom hooks, complex components
- **High Risk**: Main HomePage component with complex state

## Rollback Strategy
- Keep JavaScript files as backup during migration
- Migrate incrementally, testing each phase
- Use TypeScript's `allowJs` option during transition

## Success Criteria
- All files successfully converted to TypeScript
- Zero TypeScript compilation errors
- App functions identically to JavaScript version
- Build process works without issues
- Improved developer experience with type safety
