import React from "react";
import { ArrowDownIcon, ArrowRightIcon } from "./Icons.jsx";

const FeaturesMenu = ({ featuresMenuOpen, onToggleMenu }) => {
  return (
    <>
      <div
        style={{ padding: 8, borderBottom: "1px solid", borderTop: "1px solid", fontSize: 16 }}
        onClick={onToggleMenu}
      >
        Upcoming Features
        {featuresMenuOpen ? <ArrowDownIcon /> : <ArrowRightIcon />}
      </div>

      {featuresMenuOpen && (
        <div style={{ padding: 8, lineHeight: 1.5 }}>
          - The ability to save specific collections and name them, not just one default collection.
          <br />
          <br />
          - The ability to share collections via a url, not just by taking a screenshot of the collection or showing the collection to someone in person.
          <br />
          <br />
          - The ability to search by pokemon's name
          <br />
          <br />
          - Better gender sorting
        </div>
      )}
    </>
  );
};

export default FeaturesMenu;
