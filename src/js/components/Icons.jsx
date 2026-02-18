import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';

export const CheckedIcon = () => (
  <div style={{ paddingRight: 8 }}>
    <FontAwesomeIcon icon={faCheckSquare} />
  </div>
);

export const UncheckedIcon = () => (
  <div style={{ paddingRight: 8 }}>
    <FontAwesomeIcon icon={faSquare} />
  </div>
);

export const ArrowDownIcon = () => (
  <span style={{ paddingLeft: 8 }}>
    <FontAwesomeIcon icon={faAngleDown} />
  </span>
);

export const ArrowRightIcon = () => (
  <span style={{ paddingLeft: 8 }}>
    <FontAwesomeIcon icon={faAngleRight} />
  </span>
);
