import React from "react";
import { ArrowDownIcon, ArrowRightIcon } from "./Icons.jsx";

const AboutMenu = ({ aboutMenuOpen, onToggleMenu }) => {
  return (
    <>
      <div
        style={{
          padding: 8,
          fontSize: 16,
          borderBottom: aboutMenuOpen ? "1px solid" : "0px"
        }}
        onClick={onToggleMenu}
      >
        About
        {aboutMenuOpen ? <ArrowDownIcon /> : <ArrowRightIcon />}
      </div>

      {aboutMenuOpen && (
        <div style={{ padding: 8, lineHeight: 1.5 }}>
          Pogo Collector is a tool for helping show friends what Pokemon you are looking for in Pokemon Go! This app remembers your Pokemon selections* and the filters you have active.
          <br />
          <br />
          *Unless you clear your browser's data / cache
        </div>
      )}
    </>
  );
};

export default AboutMenu;
