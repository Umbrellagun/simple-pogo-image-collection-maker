import { useState, useEffect, useCallback } from "react";
import { listAll, StorageReference } from "firebase/storage";
import useLocalStorage from "./useLocalStorage";
import imageParser, { ParsedPokemon } from "../image_parser";

interface UsePokemonReturn {
  pokemon: ParsedPokemon[];
  loading: boolean;
  refetch: () => Promise<void>;
}

const usePokemon = (currentVersion: number): UsePokemonReturn => {
  const [pokemon, setPokemon] = useLocalStorage<ParsedPokemon[]>("pokemon", []);
  const [version, setVersion] = useLocalStorage<number | null>("version", null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPokemon = useCallback(async () => {
    try {
      const res = await listAll(window.storage as StorageReference);
      const updatedPokemon = res.items.map((image) => 
        imageParser(image.fullPath)
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
