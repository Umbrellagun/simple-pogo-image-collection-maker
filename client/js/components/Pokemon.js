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
    const { pokemon, onClick } = this.props;

    const style = {
      width: 120,
      height: 120,
      // borderRadius: 2
      // background: `url(/../images/live_pokemon_icons/${pokemon.image}) center center / contain no-repeat`,
      // backgroundColor: (pokemon.selected) ? ("red") : ("grey"),
    };

    const className = (pokemon.selected) ? ("selected") : ("unselected");

    return (
      <div>        
        <div style={{margin: 8, borderRadius: 2}} className={className} onClick={()=>{onClick(pokemon);}}>
          <img style={style} src={`/../images/live_pokemon_icons/${pokemon.image}`}/>
        </div>
      </div>
    );
  }
}
