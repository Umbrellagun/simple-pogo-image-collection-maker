import React     from "react";
import PropTypes from "prop-types";
import axios     from "axios";

import Pokemon   from "./components/Pokemon.js";

import styles    from "./styles.js";

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
    if (localStorage.pokemon){
      this.setState({
        pokemon: JSON.parse(localStorage.pokemon)
      });
    } else {
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
    }
  };

  addRemovePokemon = (pokemon)=>{
    const newPokemon = JSON.parse(JSON.stringify(this.state.pokemon));

    newPokemon[pokemon.id].selected = !newPokemon[pokemon.id].selected;

    this.setState({
      pokemon: newPokemon
    }, this.syncLocalStorage);
  }

  renderPokemon = (pokemon, key)=>{

    return (
      <Pokemon
        key={key}
        pokemon={pokemon}
        onClick={this.addRemovePokemon}
      />
    );
  };

  renderSelectedPokemon = (pokemon, key)=>{
    if (pokemon.selected){
      return (
        <Pokemon
          key={key}
          pokemon={pokemon}
          onClick={this.addRemovePokemon}
        />
      );
    }
  }

  doneSelecting = ()=>{
    this.setState({
      done: true
    });
  };

  backToSelecting = ()=>{
    this.setState({
      done: false
    });
  }

  syncLocalStorage = ()=>{
    localStorage.pokemon = JSON.stringify(this.state.pokemon);
  }

  render(){
    const { done, pokemon, selected_pokemon } = this.state;
    const style = {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      flexWrap: "wrap",
      maxHeight: "100vh",
      overflow: "auto",
      backgroundColor: "white",
      borderRadius: 8
    };

    const buttonStyle = {
      padding: 8,
      backgroundColor: "darkcyan",
      borderRadius: 4,
      color: "white",
      margin: 8
    };

    const containerStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      color: "darkcyan",
      fontWeight: 600
    };

    let shownPokemon;
    let navigationButton;
    if (done){
      shownPokemon = pokemon.map(this.renderSelectedPokemon);
      navigationButton = (
        <div style={buttonStyle} onClick={this.backToSelecting}>Back</div>
      );
    } else {
      shownPokemon = pokemon.map(this.renderPokemon);
      navigationButton = (
        <div style={buttonStyle} onClick={this.doneSelecting}>Done Selecting</div>
      );
    }

    return (
      <div style={containerStyle}>
        <div style={{fontSize: 21}}>
          PoGo Collector
        </div>
        <div>
          Select the Pokemon you would like
        </div>
        <div>
          {navigationButton}
        </div>
        <div style={style}>
          {shownPokemon}
        </div>
      </div>
    );
  }
}
