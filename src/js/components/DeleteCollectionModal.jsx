import React from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from "../styles.js";

const DeleteCollectionModal = ({
  isOpen,
  onClose,
  onDelete,
  collectionName,
  deleted
}) => {
  return (
    <Modal
      isOpen={isOpen}
      closeTimeoutMS={150}
      onRequestClose={onClose}
    >
      <div>
        {deleted ? (
          <div style={{ color: "red", textAlign: "center" }}>Collection Deleted!</div>
        ) : (
          <div>
            <div style={styles.closeX}>
              <FontAwesomeIcon onClick={onClose} icon={faTimes} />
            </div>
            <div style={{ marginTop: 16, textAlign: "center" }}>
              Are you sure you want to delete the {collectionName} collection?
            </div>
            <div
              className="shadow"
              style={{
                ...styles.buttonStyle,
                marginTop: 16,
                marginBottom: 16,
                backgroundColor: "red",
                fontWeight: 600,
                fontSize: 16
              }}
              onClick={onDelete}
            >
              DELETE
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DeleteCollectionModal;
