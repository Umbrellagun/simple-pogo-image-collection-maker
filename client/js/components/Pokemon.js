import React     from "react";
import PropTypes from "prop-types";

import styles    from "../styles.js";

export default class Pokemon extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    const { pokemon, onClick, toggleFullyRemovePokemon, showFullyRemoveButton, selectedScreen } = this.props;

    const style = {
      width: (selectedScreen) ? (80) : (80),
      height: (selectedScreen) ? (80) : (80),
    };

    const xButton = {
      color: "white",
      backgroundColor: "red",
      borderRadius: "50%",
      width: 20,
      height: 20,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      marginTop: 8
    };

    const shinyStyle = {
      background: `url(/../images/shiny.png) center center / contain no-repeat`,
      width: (selectedScreen) ? (26) : (26),
      height: (selectedScreen) ? (26) : (26),
      position: "absolute",
      bottom: 0,
      right: 0
    };

    const className = (pokemon.selected) ? ("selected") : ("unselected");

    const fullyRemoveButton = (showFullyRemoveButton) ? (
      <div style={xButton} onClick={()=>{toggleFullyRemovePokemon(pokemon);}}>X</div>
    ) : (null);

    const shiny = (pokemon.shiny) ? (
      <div style={shinyStyle}></div>
    ) : (null);

    return (
      <div>
        {fullyRemoveButton}
        <div style={{margin: 8, borderRadius: 2, cursor: "pointer", position: "relative"}} className={className} onClick={()=>{onClick(pokemon);}}>
          <img style={style} src={`/../images/live_pokemon_icons/${pokemon.image}`}/>
          {shiny}
        </div>
      </div>
    );
  }
}
