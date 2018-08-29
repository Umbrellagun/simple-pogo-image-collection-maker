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

  addRemovePokemon = (pokemon)=>{
    // const selected_pokemon = JSON.parse(JSON.stringify(this.state.selected_pokemon));
    const newPokemon = JSON.parse(JSON.stringify(this.state.pokemon));

    newPokemon[pokemon.id].selected = !newPokemon[pokemon.id].selected;

    // selected_pokemon.push(newPokemon[pokemon.id]);

    this.setState({
      pokemon: newPokemon
    });
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

  render(){
    const { done, pokemon, selected_pokemon } = this.state;
    const style = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
      maxHeight: "100vh",
      overflow: "auto"
    };

    let shownPokemon;
    let navigationButton;
    if (done){
      shownPokemon = pokemon.map(this.renderSelectedPokemon);
      navigationButton = (<div onClick={this.backToSelecting}>Back</div>);
    } else {
      shownPokemon = pokemon.map(this.renderPokemon);
      navigationButton = (<div onClick={this.doneSelecting}>Done Selecting</div>);
    }

    return (
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
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
