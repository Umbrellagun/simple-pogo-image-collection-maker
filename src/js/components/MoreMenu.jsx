import React from "react";
import { CheckedIcon, UncheckedIcon, ArrowDownIcon, ArrowRightIcon } from "./Icons.jsx";
import styles from "../styles.js";

const MoreMenu = ({
  moreMenuOpen,
  options,
  onToggleMenu,
  onToggleXButtons,
  onToggleAllPokemon,
  onToggleAllShiny,
  onViewRemoved,
  onClearRemovedPokemon,
  onClearSelectedPokemon
}) => {
  return (
    <>
      <div
        style={{ padding: 8, borderBottom: "1px solid", borderTop: "1px solid", fontSize: 16 }}
        onClick={onToggleMenu}
      >
        More
        {moreMenuOpen ? <ArrowDownIcon /> : <ArrowRightIcon />}
      </div>

      {moreMenuOpen && (
        <div style={{ borderBottom: "1px solid" }}>
          <div style={styles.regularButtonStyle} onClick={onToggleXButtons}>
            {options.showXButtons ? <CheckedIcon /> : <UncheckedIcon />}
            <span style={{ paddingTop: 1, textAlign: "left" }}>
              Show 'Remove Pokemon' Buttons
            </span>
          </div>
          <div style={styles.regularButtonStyle} onClick={onToggleAllPokemon}>
            {options.showAllPokemon ? <CheckedIcon /> : <UncheckedIcon />}
            <span style={{ paddingTop: 1, textAlign: "left" }}>
              Show Pokemon Not In Game Yet
            </span>
          </div>
          <div style={styles.regularButtonStyle} onClick={onToggleAllShiny}>
            {options.showAllShiny ? <CheckedIcon /> : <UncheckedIcon />}
            <span style={{ paddingTop: 1, textAlign: "left" }}>
              Show Shiny Pokemon Not In Game Yet
            </span>
          </div>
          <div className="shadow" style={styles.redButtonStyle} onClick={onViewRemoved}>
            View Removed Pokemon
          </div>
          <div className="shadow" style={styles.redButtonStyle} onClick={onClearRemovedPokemon}>
            Clear All Removed Pokemon
          </div>
          <div className="shadow" style={styles.redButtonStyle} onClick={onClearSelectedPokemon}>
            Clear All Current Collection's Selected Pokemon
          </div>
        </div>
      )}
    </>
  );
};

export default MoreMenu;
