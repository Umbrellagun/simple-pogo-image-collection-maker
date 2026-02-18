import { useCallback } from "react";
import useLocalStorage from "./useLocalStorage.js";

const DEFAULT_COLLECTIONS = {
  default: {
    name: "My Collection",
    pokemon_ids: {}
  }
};

const useCollections = () => {
  const [collections, setCollections] = useLocalStorage("collections", DEFAULT_COLLECTIONS);
  const [currentCollection, setCurrentCollection] = useLocalStorage("current_collection", "default");
  const [removedPokemon, setRemovedPokemon] = useLocalStorage("removed_pokemon", {});

  const addRemovePokemon = useCallback((pokemonId) => {
    setCollections((prev) => {
      const newCollections = JSON.parse(JSON.stringify(prev));
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
      const newCollections = JSON.parse(JSON.stringify(prev));
      newCollections[currentCollection].pokemon_ids = {};
      return newCollections;
    });
  }, [currentCollection, setCollections]);

  const toggleFullyRemovePokemon = useCallback((pokemonId) => {
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

  const addNewCollection = useCallback(() => {
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

  const deleteCollection = useCallback((collectionId) => {
    setCollections((prev) => {
      const newCollections = { ...prev };
      delete newCollections[collectionId];
      return newCollections;
    });
  }, [setCollections]);

  const updateCollectionName = useCallback((name) => {
    setCollections((prev) => ({
      ...prev,
      [currentCollection]: {
        ...prev[currentCollection],
        name: name || ""
      }
    }));
  }, [currentCollection, setCollections]);

  const getSharingUrl = useCallback((collectionId) => {
    const collection = collections[collectionId];
    if (!collection) return "";

    let url = `https://pogocollector.com/?collection_name=${collection.name.replace(/ /g, "%20")}&pokemon=`;

    Object.keys(collection.pokemon_ids).forEach((id, key) => {
      const comma = key !== 0 ? "," : "";
      url = `${url}${comma}${id}`;
    });

    return url;
  }, [collections]);

  const addSharedCollection = useCallback((sharedCollection) => {
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
