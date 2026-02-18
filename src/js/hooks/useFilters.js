import { useCallback } from "react";
import useLocalStorage from "./useLocalStorage.js";

const DEFAULT_FILTERS = {
  shiny: true,
  special: true,
  regular: true,
  additional_gender: false,
  gen_1: true,
  gen_2: true,
  gen_3: true,
  gen_4: true,
  gen_5: true,
};

const DEFAULT_OPTIONS = {
  showXButtons: true,
  showAllShiny: false,
  showAllPokemon: false,
};

const useFilters = () => {
  const [filters, setFilters] = useLocalStorage("filters", DEFAULT_FILTERS);
  const [options, setOptions] = useLocalStorage("options", DEFAULT_OPTIONS);

  const toggleFilter = useCallback((filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  }, [setFilters]);

  const toggleXButtons = useCallback(() => {
    setOptions((prev) => ({
      ...prev,
      showXButtons: !prev.showXButtons
    }));
  }, [setOptions]);

  const toggleAllShiny = useCallback(() => {
    setOptions((prev) => ({
      ...prev,
      showAllShiny: !prev.showAllShiny
    }));
  }, [setOptions]);

  const toggleAllPokemon = useCallback(() => {
    setOptions((prev) => ({
      ...prev,
      showAllPokemon: !prev.showAllPokemon
    }));
  }, [setOptions]);

  return {
    filters,
    options,
    toggleFilter,
    toggleXButtons,
    toggleAllShiny,
    toggleAllPokemon
  };
};

export default useFilters;
