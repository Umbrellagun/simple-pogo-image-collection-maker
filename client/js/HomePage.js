import React       from "react";
import PropTypes   from "prop-types";
import axios from "axios";

import styles      from "./styles.js";

export default class HomePage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      pokemon: [],
      selected_pokemon: [],
      exclude_shiny: false,
      exclude_special: false,
      show_only_shiny: false,
      done: false
    }
    this.selectedPokemon = [];
  }

  componentWillMount = ()=>{
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    const host = (hostname === "localhost") ? (`${protocol}//${hostname}:1333/thing`) : (`${protocol}//${hostname}/thing`);

    axios.get(host).then((response)=>{
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

        const selected_pokemon = JSON.parse(JSON.stringify(this.state.selected_pokemon));
        selected_pokemon.push(pokemon);
        console.log(selected_pokemon);
        this.setState({
          selected_pokemon
        });
      }}>
      </div>
    );
  };

  renderSelectedPokemon = (pokemon, key)=>{
    const style = {
      width: 140,
      height: 140,
      background: `url(/../images/live_pokemon_icons/${pokemon.image}) center center / contain no-repeat`
    };

    return (
      <div key={key} style={style}></div>
    );
  }

  render(){
    const { done, pokemon, selected_pokemon } = this.state;
    const style = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap"
    };

    const shownPokemon = (done) ? (selected_pokemon.map(this.renderSelectedPokemon)) : (pokemon.map(this.renderPokemon));

    return (
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
        <div>
          Select the Pokemon you would like
        </div>
        <div>
          <div onClick={()=>{
            this.setState({
              done: true
            });
          }}>Done Selecting</div>
        </div>
        <div style={style}>
          {shownPokemon}
        </div>
      </div>
    );
  }
}
