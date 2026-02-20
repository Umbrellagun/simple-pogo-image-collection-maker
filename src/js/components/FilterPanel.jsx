import React from "react";
import { CheckedIcon, UncheckedIcon, ArrowDownIcon, ArrowRightIcon } from "./Icons.jsx";
import styles from "../styles";

const FilterPanel = ({ filters, filtersMenuOpen, onToggleMenu, onToggleFilter }) => {
  const getFilterName = (filter) => {
    if (filter[3] === "_") {
      let newFilterName = filter;
      newFilterName = newFilterName.substr(0, 3) + " " + newFilterName.substr(3 + " ".length);
      return newFilterName.charAt(0).toUpperCase() + newFilterName.slice(1);
    } else if (filter[10] === "_") {
      return "Additional Genders";
    } else {
      return filter.charAt(0).toUpperCase() + filter.slice(1);
    }
  };

  const renderFilters = () => {
    return Object.keys(filters).map((filter, key) => {
      const filterName = getFilterName(filter);
      const additionalStyle = filter[10] === "_" ? { width: "100%" } : {};

      return (
        <div
          key={key}
          style={{ ...styles.filterStyle, ...additionalStyle }}
          onClick={() => onToggleFilter(filter)}
        >
          {filters[filter] ? <CheckedIcon /> : <UncheckedIcon />}
          <div style={{ paddingTop: 1 }}>{filterName}</div>
        </div>
      );
    });
  };

  return (
    <>
      <div style={{ padding: 8, fontSize: 16 }} onClick={onToggleMenu}>
        Filters
        {filtersMenuOpen ? <ArrowDownIcon /> : <ArrowRightIcon />}
      </div>

      {filtersMenuOpen && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {renderFilters()}
        </div>
      )}
    </>
  );
};

export default FilterPanel;
