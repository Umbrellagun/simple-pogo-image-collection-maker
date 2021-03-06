import React     from "react";
import PropTypes from "prop-types";

import LazyLoad  from "react-lazy-load";

import styles    from "../styles.js";

export default class Pokemon extends React.Component {

  render(){
    const {
      pokemon,
      onClick,
      toggleFullyRemovePokemon,
      showFullyRemoveButton,
      selectedScreen,
      selected
    } = this.props;

    const selectedStyle = (selected) ? (styles.selected) : ({});

    const fullyRemoveButton = (showFullyRemoveButton) ? (
      <div style={styles.xButton} onClick={()=>{
        toggleFullyRemovePokemon(pokemon);
      }}>X</div>
    ) : (null);

    const shiny = (pokemon.shiny) ? (
      <div style={styles.shinyStyle}></div>
    ) : (null);

    return (
      <div style={{position: 'relative'}}>
        {fullyRemoveButton}
        <div style={{...{margin: 8, borderRadius: 6, cursor: "pointer"}, ...selectedStyle}} onClick={()=>{onClick(pokemon);}}>
          <LazyLoad offset={600}>
            <img style={styles.imgStyle} src={`https://firebasestorage.googleapis.com/v0/b/pogo-collector-e42c9.appspot.com/o/${pokemon.image}?alt=media`} alt={`pokemon ${pokemon.number}`}/>
          </LazyLoad>
          {shiny}
        </div>
      </div>
    );
  }
}
