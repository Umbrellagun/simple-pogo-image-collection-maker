import React from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import copy from "copy-to-clipboard";
import styles from "../styles";

const ShareCollectionModal = ({
  isOpen,
  onClose,
  url,
  copied,
  onCopy
}) => {
  const handleCopy = () => {
    copy(url);
    onCopy();
  };

  return (
    <Modal
      isOpen={isOpen}
      closeTimeoutMS={150}
      onRequestClose={onClose}
    >
      <div>
        <div style={styles.closeX}>
          <FontAwesomeIcon onClick={onClose} icon={faTimes} />
        </div>
        <div
          className="shadow"
          style={{
            ...styles.buttonStyle,
            marginTop: 16,
            marginBottom: 16,
            fontWeight: 600
          }}
          onClick={handleCopy}
        >
          Copy Link
        </div>
        {copied && (
          <div style={{ color: "red", marginBottom: 8 }}>Link Copied!</div>
        )}
        <div style={{ wordWrap: "break-word" }}>{url}</div>
      </div>
    </Modal>
  );
};

export default ShareCollectionModal;
