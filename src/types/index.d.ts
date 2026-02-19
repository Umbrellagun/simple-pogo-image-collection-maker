// Global type definitions for the PoGo Collector app

// Pokemon type
export interface Pokemon {
  number: string;
  image: string;
  shiny: boolean;
  form?: string;
  costume?: string;
  gender?: string;
}

// Collection type
export interface Collection {
  name: string;
  pokemon_ids: Record<string, string>;
}

// Filter options
export interface Filters {
  shiny: boolean;
  normal: boolean;
  costume: boolean;
  male: boolean;
  female: boolean;
  genderless: boolean;
}

// App options
export interface AppOptions {
  showXButtons: boolean;
  showAllPokemon: boolean;
  showAllShiny: boolean;
}

// Shared collection from URL
export interface SharedCollection {
  name: string;
  pokemon_ids: Record<string, string>;
}

// Firebase Storage reference type
declare global {
  interface Window {
    storage: import('firebase/storage').StorageReference;
  }
}

// Environment variables
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_DATABASE_URL: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
  readonly VITE_FIREBASE_STORAGE_URL: string;
  readonly PACKAGE_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
