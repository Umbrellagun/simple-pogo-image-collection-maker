import { useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

export interface Collection {
  name: string;
  pokemon_ids: Record<string, string>;
}

export interface Collections {
  [key: string]: Collection;
}

export interface SharedCollection {
  name: string;
  pokemon_ids: Record<string, string>;
}

interface UseCollectionsReturn {
  collections: Collections;
  currentCollection: string;
  setCurrentCollection: (value: string | ((prev: string) => string)) => void;
  removedPokemon: Record<string, string>;
  addRemovePokemon: (pokemonId: string) => void;
  clearAllSelectedPokemon: () => void;
  toggleFullyRemovePokemon: (pokemonId: string) => void;
  clearAllRemovedPokemon: () => void;
  addNewCollection: () => string;
  deleteCollection: (collectionId: string) => void;
  updateCollectionName: (name: string) => void;
  getSharingUrl: (collectionId: string) => string;
  addSharedCollection: (sharedCollection: SharedCollection) => string;
}

const DEFAULT_COLLECTIONS: Collections = {
  default: {
    name: "My Collection",
    pokemon_ids: {}
  }
};

const useCollections = (): UseCollectionsReturn => {
  const [collections, setCollections] = useLocalStorage<Collections>("collections", DEFAULT_COLLECTIONS);
  const [currentCollection, setCurrentCollection] = useLocalStorage<string>("current_collection", "default");
  const [removedPokemon, setRemovedPokemon] = useLocalStorage<Record<string, string>>("removed_pokemon", {});

  const addRemovePokemon = useCallback((pokemonId: string) => {
    setCollections((prev) => {
      const newCollections = JSON.parse(JSON.stringify(prev)) as Collections;
      if (newCollections[currentCollection].pokemon_ids[pokemonId]) {
        delete newCollections[currentCollection].pokemon_ids[pokemonId];
      } else {
        newCollections[currentCollection].pokemon_ids[pokemonId] = pokemonId;
      }
      return newCollections;
    });
  }, [currentCollection, setCollections]);

  const clearAllSelectedPokemon = useCallback(() => {
    setCollections((prev) => {
      const newCollections = JSON.parse(JSON.stringify(prev)) as Collections;
      newCollections[currentCollection].pokemon_ids = {};
      return newCollections;
    });
  }, [currentCollection, setCollections]);

  const toggleFullyRemovePokemon = useCallback((pokemonId: string) => {
    setRemovedPokemon((prev) => {
      const newRemoved = { ...prev };
      if (newRemoved[pokemonId]) {
        delete newRemoved[pokemonId];
      } else {
        newRemoved[pokemonId] = pokemonId;
      }
      return newRemoved;
    });
  }, [setRemovedPokemon]);

  const clearAllRemovedPokemon = useCallback(() => {
    setRemovedPokemon({});
  }, [setRemovedPokemon]);

  const addNewCollection = useCallback((): string => {
    const newId = Date.now().toString();
    setCollections((prev) => ({
      ...prev,
      [newId]: {
        name: "New Collection",
        pokemon_ids: {}
      }
    }));
    return newId;
  }, [setCollections]);

  const deleteCollection = useCallback((collectionId: string) => {
    setCollections((prev) => {
      const newCollections = { ...prev };
      delete newCollections[collectionId];
      return newCollections;
    });
  }, [setCollections]);

  const updateCollectionName = useCallback((name: string) => {
    setCollections((prev) => ({
      ...prev,
      [currentCollection]: {
        ...prev[currentCollection],
        name: name || ""
      }
    }));
  }, [currentCollection, setCollections]);

  const getSharingUrl = useCallback((collectionId: string): string => {
    const collection = collections[collectionId];
    if (!collection) return "";

    let url = `https://pogocollector.com/?collection_name=${collection.name.replace(/ /g, "%20")}&pokemon=`;

    Object.keys(collection.pokemon_ids).forEach((id, key) => {
      const comma = key !== 0 ? "," : "";
      url = `${url}${comma}${id}`;
    });

    return url;
  }, [collections]);

  const addSharedCollection = useCallback((sharedCollection: SharedCollection): string => {
    const newId = Date.now().toString();
    setCollections((prev) => ({
      ...prev,
      [newId]: {
        name: sharedCollection.name,
        pokemon_ids: sharedCollection.pokemon_ids
      }
    }));
    setCurrentCollection(newId);
    return newId;
  }, [setCollections, setCurrentCollection]);

  return {
    collections,
    currentCollection,
    setCurrentCollection,
    removedPokemon,
    addRemovePokemon,
    clearAllSelectedPokemon,
    toggleFullyRemovePokemon,
    clearAllRemovedPokemon,
    addNewCollection,
    deleteCollection,
    updateCollectionName,
    getSharingUrl,
    addSharedCollection
  };
};

export default useCollections;
