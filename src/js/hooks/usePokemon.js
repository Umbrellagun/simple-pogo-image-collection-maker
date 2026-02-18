import { useState, useEffect, useCallback } from "react";
import { listAll } from "firebase/storage";
import useLocalStorage from "./useLocalStorage.js";
import image_parser from "../image_parser.js";

const usePokemon = (currentVersion) => {
  const [pokemon, setPokemon] = useLocalStorage("pokemon", []);
  const [version, setVersion] = useLocalStorage("version", null);
  const [loading, setLoading] = useState(true);

  const fetchPokemon = useCallback(async () => {
    try {
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
  }, [currentVersion, setPokemon, setVersion]);

  useEffect(() => {
    if (version !== currentVersion) {
      fetchPokemon();
    } else {
      setLoading(false);
    }
  }, [version, currentVersion, fetchPokemon]);

  const sortedPokemon = [...pokemon].sort((a, b) => 
    parseInt(a.number) - parseInt(b.number)
  );

  return {
    pokemon: sortedPokemon,
    loading,
    refetch: fetchPokemon
  };
};

export default usePokemon;
