import { useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

export interface Filters {
  shiny: boolean;
  special: boolean;
  regular: boolean;
  additional_gender: boolean;
  gen_1: boolean;
  gen_2: boolean;
  gen_3: boolean;
  gen_4: boolean;
  gen_5: boolean;
  [key: string]: boolean;
}

export interface Options {
  showXButtons: boolean;
  showAllShiny: boolean;
  showAllPokemon: boolean;
}

interface UseFiltersReturn {
  filters: Filters;
  options: Options;
  toggleFilter: (filterName: string) => void;
  toggleXButtons: () => void;
  toggleAllShiny: () => void;
  toggleAllPokemon: () => void;
}

const DEFAULT_FILTERS: Filters = {
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

const DEFAULT_OPTIONS: Options = {
  showXButtons: true,
  showAllShiny: false,
  showAllPokemon: false,
};

const useFilters = (): UseFiltersReturn => {
  const [filters, setFilters] = useLocalStorage<Filters>("filters", DEFAULT_FILTERS);
  const [options, setOptions] = useLocalStorage<Options>("options", DEFAULT_OPTIONS);

  const toggleFilter = useCallback((filterName: string) => {
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
