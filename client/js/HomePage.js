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
      panel: "selecting"
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
  };

  toggleFullyRemovePokemon = (pokemon)=>{
    const newPokemon = JSON.parse(JSON.stringify(this.state.pokemon));

    newPokemon[pokemon.id].removed = !newPokemon[pokemon.id].removed;

    this.setState({
      pokemon: newPokemon
    }, this.syncLocalStorage);
  };

  renderPokemon = (pokemon, key)=>{
    if (!pokemon.removed){
      return (
        <Pokemon
          key={key}
          pokemon={pokemon}
          onClick={this.addRemovePokemon}
          toggleFullyRemovePokemon={this.toggleFullyRemovePokemon}
          showFullyRemoveButton={true}
        />
      );
    }
  };

  renderFullyRemovedPokemon = (pokemon, key)=>{
    if (pokemon.removed){
      return (
        <Pokemon
          key={key}
          pokemon={pokemon}
          onClick={this.addRemovePokemon}
          toggleFullyRemovePokemon={this.toggleFullyRemovePokemon}
          showFullyRemoveButton={true}
        />
      );
    }
  }

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
      panel: "done"
    });
  };

  backToSelecting = ()=>{
    this.setState({
      panel: "selecting"
    });
  };

  veiwRemoved = ()=>{
    this.setState({
      panel: "removed"
    });
  };

  syncLocalStorage = ()=>{
    localStorage.pokemon = JSON.stringify(this.state.pokemon);
  }

  render(){
    const { panel, pokemon, selected_pokemon } = this.state;
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
      margin: 8,
      backgroundColor: "darkcyan",
      borderRadius: 4,
      color: "white",
      cursor: "pointer"
    };

    const containerStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      color: "darkcyan",
      fontWeight: 600
    };

    const buttonsStyle = {
      display: "flex"
    };

    const removedStyle = {
      padding: 8,
      margin: 8,
      borderRadius: 4,
      color: "white",
      cursor: "pointer",
      backgroundColor: "red"
    };

    let shownPokemon;
    let navigationButton;
    if (panel === "done"){
      shownPokemon = pokemon.map(this.renderSelectedPokemon);
      navigationButton = (
        <div style={buttonStyle} onClick={this.backToSelecting}>Back</div>
      );
    } else if (panel === "selecting"){
      shownPokemon = pokemon.map(this.renderPokemon);
      navigationButton = (
        <div style={buttonStyle} onClick={this.doneSelecting}>Done Selecting</div>
      );
    } else if (panel === "removed"){
      shownPokemon = pokemon.map(this.renderFullyRemovedPokemon);
      navigationButton = (
        <div style={buttonStyle} onClick={this.backToSelecting}>Back</div>
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
        <div style={buttonsStyle}>
          <div style={removedStyle} onClick={this.veiwRemoved}>Removed Pokemon</div>
          {navigationButton}
        </div>
        <div style={style}>
          {shownPokemon}
        </div>
      </div>
    );
  }
}
