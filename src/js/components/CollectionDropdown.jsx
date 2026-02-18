import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faShareAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ArrowDownIcon, ArrowRightIcon } from "./Icons.jsx";
import styles from "../styles.js";

const CollectionDropdown = ({
  collections,
  currentCollection,
  editingName,
  dropdownOpen,
  onToggleEdit,
  onToggleDropdown,
  onNameChange,
  onSelectCollection,
  onShareCollection,
  onDeleteCollection,
  onAddNewCollection
}) => {
  const collection = collections[currentCollection];
  const collectionName = collection ? collection.name : "";

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
      <div onClick={onToggleEdit} style={{ paddingRight: 8 }}>
        <FontAwesomeIcon icon={faPencilAlt} />
      </div>
      <div style={{ marginRight: 8 }}>Selecting for </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          {editingName ? (
            <input
              name="collection-name"
              style={styles.inputStyle}
              onChange={onNameChange}
              onBlur={onToggleEdit}
              value={collectionName}
            />
          ) : (
            collectionName
          )}
        </div>
        <div onClick={onToggleDropdown}>
          {dropdownOpen ? <ArrowDownIcon /> : <ArrowRightIcon />}
        </div>
        {dropdownOpen && (
          <div className="shadow" style={styles.dropdownMenuStyle}>
            {Object.keys(collections).map((key) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{ padding: 4 }}
                  onClick={() => onSelectCollection(key)}
                >
                  {collections[key].name}
                </div>
                <div>
                  <FontAwesomeIcon
                    onClick={() => onShareCollection(key)}
                    style={{ paddingLeft: 4, paddingRight: 16 }}
                    icon={faShareAlt}
                  />
                  <FontAwesomeIcon
                    onClick={() => onDeleteCollection(key)}
                    icon={faTimes}
                  />
                </div>
              </div>
            ))}
            <div style={{ padding: 4 }} onClick={onAddNewCollection}>
              + New Collection
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDropdown;
