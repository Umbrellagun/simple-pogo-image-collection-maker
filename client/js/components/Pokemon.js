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
    const { pokemon, onClick, toggleFullyRemovePokemon, showFullyRemoveButton } = this.props;

    const style = {
      width: 120,
      height: 120,
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

    const className = (pokemon.selected) ? ("selected") : ("unselected");

    const fullyRemoveButton = (showFullyRemoveButton) ? (
      <div style={xButton} onClick={()=>{toggleFullyRemovePokemon(pokemon);}}>X</div>
    ) : (null);

    return (
      <div>
        {fullyRemoveButton}
        <div style={{margin: 8, borderRadius: 2, cursor: "pointer"}} className={className} onClick={()=>{onClick(pokemon);}}>
          <img style={style} src={`/../images/live_pokemon_icons/${pokemon.image}`}/>
        </div>
      </div>
    );
  }
}
