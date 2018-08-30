import React     from "react";
import PropTypes from "prop-types";
import axios     from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';

import Pokemon   from "./components/Pokemon.js";

import styles    from "./styles.js";

export default class HomePage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      pokemon: [],
      filters: {
        shiny: true,
        special: true,
        regular: true
      },
      panel: "selecting"
    }
    this.selectedPokemon = [];
  }

  componentWillMount = ()=>{

    if (localStorage.version){
      if (JSON.parse(localStorage.version) !== 0){
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;

        const host = (hostname === "localhost") ? (`${protocol}//${hostname}:1333/thing`) : (`${protocol}//${hostname}/thing`);

        axios.get(host).then((response)=>{
          const oldPokemon = JSON.parse(localStorage.pokemon);

          const updatedPokemon = JSON.parse(response.data).map((pokemon, key)=>{
            return Object.assign({}, pokemon, oldPokemon[key]);
          });

          this.setState({
            pokemon: updatedPokemon
          }, this.syncLocalStorage);

        }).catch((error)=>{
          console.log(error);
        });

      } else {
        this.setState({
          pokemon: JSON.parse(localStorage.pokemon),
          filters: JSON.parse(localStorage.filters)
        });
      }
    } else {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;

      const host = (hostname === "localhost") ? (`${protocol}//${hostname}:1333/thing`) : (`${protocol}//${hostname}/thing`);

      axios.get(host).then((response)=>{
        this.setState({
          pokemon: JSON.parse(response.data)
        }, this.syncLocalStorage);
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
    const { filters } = this.state;

    let shinyCheck = true;
    if (!filters.shiny){
      if (pokemon.shiny){
        shinyCheck = false;
      } else {
        shinyCheck = true;
      }
    }

    let specialCheck = true;
    if (!filters.special){
      if (pokemon.special){
        specialCheck = false;
      } else {
        specialCheck = true;
      }
    }

    let regularCheck = true;
    if (!filters.regular){
      if (pokemon.regular){
        regularCheck = false;
      } else {
        regularCheck = true;
      }
    }

    if (shinyCheck && specialCheck && regularCheck && !pokemon.removed){
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
          selectedScreen={true}
        />
      );
    }
  }

  toPanel = (panel)=>{
    this.setState({
      panel
    });
  };

  toggleFilter = (filter)=>{

    const filters = Object.assign({}, this.state.filters);
    let state = {filters};

    if (filter === "toggle_shiny"){
      state.filters.shiny = !this.state.filters.shiny;
      this.setState(state);
    } else if (filter === "toggle_special"){
      state.filters.special = !this.state.filters.special;
      this.setState(state);
    } else if (filter === "toggle_regular"){
      state.filters.regular = !this.state.filters.regular;
      this.setState(state);
    }

  };

  syncLocalStorage = ()=>{
    localStorage.pokemon = JSON.stringify(this.state.pokemon);
    localStorage.filters = JSON.stringify(this.state.filters);
    localStorage.version = JSON.stringify(0);
  }

  render(){
    const { panel, pokemon, filters } = this.state;
    const style = {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      flexWrap: "wrap",
      maxHeight: "80vh",
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

    const filterStyle = {
      display: "flex",
      padding: 8
    };

    let shownPokemon;
    let navigationButton;
    if (panel === "done"){
      shownPokemon = pokemon.map(this.renderSelectedPokemon);
      navigationButton = (
        <div style={buttonStyle} onClick={()=>{this.toPanel("selecting");}}>Back</div>
      );
    } else if (panel === "selecting"){
      shownPokemon = pokemon.map(this.renderPokemon);
      navigationButton = (
        <div style={buttonStyle} onClick={()=>{this.toPanel("done");}}>Done Selecting</div>
      );
    } else if (panel === "removed"){
      shownPokemon = pokemon.map(this.renderFullyRemovedPokemon);
      navigationButton = (
        <div style={buttonStyle} onClick={()=>{this.toPanel("selecting");}}>Back</div>
      );
    }

    const checked = (
      <div style={{paddingRight: 8}}>
        <FontAwesomeIcon icon={faCheckSquare} />
      </div>
    );

    const unChecked = (
      <div style={{paddingRight: 8}}>
        <FontAwesomeIcon  icon={faSquare} />
      </div>
    );

    const shinyFilter = (
      <div style={filterStyle} onClick={()=>{this.toggleFilter("toggle_shiny");}}>
        {(filters.shiny) ? (checked) : (unChecked)}
        <div>
          Shinys
        </div>
      </div>
    );

    const specialFilter = (
      <div style={filterStyle} onClick={()=>{this.toggleFilter("toggle_special");}}>
        {(filters.special) ? (checked) : (unChecked)}
        <div>
          Specials
        </div>
      </div>
    );

    const regularFilter = (
      <div style={filterStyle} onClick={()=>{this.toggleFilter("toggle_regular");}}>
        {(filters.regular) ? (checked) : (unChecked)}
        <div>
          Regular
        </div>
      </div>
    );

    return (
      <div style={containerStyle}>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", minHeight: "20vh"}}>
          <div style={{fontSize: 21}}>
            PoGo Collector
          </div>
          <div>
            Select the Pokemon you would like
          </div>
          <div style={buttonsStyle}>
            <div style={removedStyle} onClick={()=>{this.toPanel("removed");}}>Removed Pokemon</div>
            {navigationButton}
          </div>
          <div style={filterStyle}>
            {regularFilter}
            {shinyFilter}
            {specialFilter}
          </div>
        </div>
        <div style={style}>
          {shownPokemon}
        </div>
      </div>
    );
  }
}
