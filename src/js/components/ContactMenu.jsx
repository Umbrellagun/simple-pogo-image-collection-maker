import React from "react";
import { ArrowDownIcon, ArrowRightIcon } from "./Icons.jsx";

const ContactMenu = ({ contactMenuOpen, featuresMenuOpen, onToggleMenu }) => {
  return (
    <>
      <div
        style={{
          padding: 8,
          fontSize: 16,
          borderTop: featuresMenuOpen ? "1px solid" : "0px",
          borderBottom: contactMenuOpen ? "1px solid" : "0px"
        }}
        onClick={onToggleMenu}
      >
        Contact
        {contactMenuOpen ? <ArrowDownIcon /> : <ArrowRightIcon />}
      </div>

      {contactMenuOpen && (
        <div style={{ padding: 8, lineHeight: 1.5 }}>
          If you notice anything off, mistakes, bugs, or have suggestions for features (please take a look at the upcoming features list first), feel free to contact me at calebsundance3@gmail.com
        </div>
      )}
    </>
  );
};

export default ContactMenu;
