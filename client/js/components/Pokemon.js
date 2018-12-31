import React     from "react";
import PropTypes from "prop-types";

import LazyLoad  from "react-lazy-load";

import styles    from "../styles.js";

export default class Pokemon extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    const { pokemon, onClick, toggleFullyRemovePokemon, showFullyRemoveButton, selectedScreen, selected } = this.props;

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
            <img style={styles.imgStyle} src={`/../images/pokemon_icons/${pokemon.image}`} alt={`pokemon ${pokemon.number}`}/>
          </LazyLoad>
          {shiny}
        </div>
      </div>
    );
  }
}
