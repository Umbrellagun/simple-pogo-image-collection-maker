import React       from "react";
import PropTypes   from "prop-types";
import axios from "axios";

import styles      from "./styles.js";

export default class HomePage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      pokemon: []
    }
    this.selectedPokemon = [];
  }

  componentWillMount = ()=>{
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    axios.get(`${protocol}//${hostname}/thing`).then((response)=>{
      this.setState({
        pokemon: JSON.parse(response.data)
      });
    }).catch((error)=>{
      console.log(error);
    });
  };

  renderPokemon = (pokemon, key)=>{
    const style = {
      width: 140,
      height: 140,
      background: `url(/../images/live_pokemon_icons/${pokemon.image}) center center / contain no-repeat`
    };

    return (
      <div key={key} style={style} onClick={()=>{
        this.selectedPokemon.push(pokemon.image);
      }}>
      </div>
    );
  };

  render(){
    const style = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap"
    };

    return (
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
        <div>
          Select the Pokemon you would like
        </div>
        <div>
          <div>Done Selecting</div>
        </div>
        <div onClick={()=>{
          console.log(this.selectedPokemon);
        }}></div>
        <div style={style}>
          {this.state.pokemon.map(this.renderPokemon)}
        </div>
      </div>
    );
  }
}
