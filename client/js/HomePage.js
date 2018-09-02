import React     from "react";
import PropTypes from "prop-types";
import axios     from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';

import Pokemon   from "./components/Pokemon.js";

import styles    from "./styles.js";

export default class HomePage extends React.Component {

  constructor(props){
    super(props);
    this.currentVersion = 1;
    this.state = {
      pokemon: [],
      filters: {
        shiny: true,
        special: true,
        regular: true,
        gen_1: true,
        gen_2: true,
        gen_3: true,
      },
      panel: "selecting",
      menuOpen: false,
      options: {
        showXButtons: true
      }
    };
  }

  componentWillMount = ()=>{

    // if (localStorage.version){
    //   if (JSON.parse(localStorage.version) !== this.currentVersion){
    //     const hostname = window.location.hostname;
    //     const protocol = window.location.protocol;
    //
    //     const host = (hostname === "localhost") ? (`${protocol}//${hostname}:${process.env.PORT}/pokemon`) : (`${protocol}//${hostname}/pokemon`);
    //
    //     axios.get(host).then((response)=>{
    //       const oldPokemon = JSON.parse(localStorage.pokemon);
    //
    //       const updatedPokemon = JSON.parse(response.data).map((pokemon, key)=>{
    //         return Object.assign({}, pokemon, oldPokemon[key]);
    //       });
    //
    //       this.setState({
    //         pokemon: updatedPokemon,
    //         filters: (localStorage.filters) ? (JSON.parse(localStorage.filters)) : (this.state.filters),
    //         options: (localStorage.options) ? (JSON.parse(localStorage.options)) : (this.state.options),
    //       }, this.syncLocalStorage);
    //
    //     }).catch((error)=>{
    //       console.log(error);
    //     });
    //
    //   } else {
    //     this.setState({
    //       pokemon: JSON.parse(localStorage.pokemon),
    //       filters: JSON.parse(localStorage.filters),
    //       options: JSON.parse(localStorage.options),
    //     });
    //   }
    // } else {
    //   const hostname = window.location.hostname;
    //   const protocol = window.location.protocol;
    //
    //   const host = (hostname === "localhost") ? (`${protocol}//${hostname}:${process.env.PORT}/pokemon`) : (`${protocol}//${hostname}/pokemon`);
    //
    //   axios.get(host).then((response)=>{
    //     this.setState({
    //       pokemon: JSON.parse(response.data)
    //     }, this.syncLocalStorage);
    //   }).catch((error)=>{
    //     console.log(error);
    //   });
    // }
  };

  clearAllSelectedPokemon = ()=>{
    const newPokemon = JSON.parse(JSON.stringify(this.state.pokemon));

    const newNewPokemon = newPokemon.map((pokemon)=>{
      pokemon.selected = false;
      return pokemon;
    });

    this.setState({
      pokemon: newNewPokemon
    });
  };

  clearAllRemovedPokemon = ()=>{
    const newPokemon = JSON.parse(JSON.stringify(this.state.pokemon));

    const newNewPokemon = newPokemon.map((pokemon)=>{
      pokemon.removed = false;
      return pokemon;
    });

    this.setState({
      pokemon: newNewPokemon
    });
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
    const { filters, options } = this.state;

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

    let genOneCheck = true;
    if (!filters.gen_1){
      if (pokemon.gen == 1){
        genOneCheck = false;
      } else {
        genOneCheck = true;
      }
    }

    let genTwoCheck = true;
    if (!filters.gen_2){
      if (pokemon.gen == 2){
        genTwoCheck = false;
      } else {
        genTwoCheck = true;
      }
    }

    let genThreeCheck = true;
    if (!filters.gen_3){
      if (pokemon.gen == 3){
        genThreeCheck = false;
      } else {
        genThreeCheck = true;
      }
    }

    if (shinyCheck && specialCheck && regularCheck && genOneCheck && genTwoCheck && genThreeCheck && !pokemon.removed){
      return (
        <Pokemon
          key={key}
          pokemon={pokemon}
          onClick={this.addRemovePokemon}
          toggleFullyRemovePokemon={this.toggleFullyRemovePokemon}
          showFullyRemoveButton={(options.showXButtons) ? (true) : (false)}
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
      this.setState(state, this.syncLocalStorage);
    } else if (filter === "toggle_special"){
      state.filters.special = !this.state.filters.special;
      this.setState(state, this.syncLocalStorage);
    } else if (filter === "toggle_regular"){
      state.filters.regular = !this.state.filters.regular;
      this.setState(state, this.syncLocalStorage);
    } else if (filter === "toggle_gen_1"){
      state.filters.gen_1 = !this.state.filters.gen_1;
      this.setState(state, this.syncLocalStorage);
    } else if (filter === "toggle_gen_2"){
      state.filters.gen_2 = !this.state.filters.gen_2;
      this.setState(state, this.syncLocalStorage);
    } else if (filter === "toggle_gen_3"){
      state.filters.gen_3 = !this.state.filters.gen_3;
      this.setState(state, this.syncLocalStorage);
    }

  };

  syncLocalStorage = ()=>{
    localStorage.pokemon = JSON.stringify(this.state.pokemon);
    localStorage.filters = JSON.stringify(this.state.filters);
    localStorage.options = JSON.stringify(this.state.options);
    localStorage.version = JSON.stringify(this.currentVersion);
  }

  toggleXButtons = ()=>{
    let state = {};
    state.options = Object.assign({}, this.state.options);
    state.options.showXButtons = !this.state.options.showXButtons;
    this.setState(state);
  };

  render(){
    const { panel, pokemon, filters, menuOpen, options } = this.state;
    const style = {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      flexWrap: "wrap",
      maxHeight: "80vh",
      overflow: "auto",
      backgroundColor: "white",
      position: "relative",
      borderRadius: 8,
      width: "100%"
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

    const redButtonStyle = {
      padding: 8,
      margin: 8,
      borderRadius: 4,
      color: "white",
      cursor: "pointer",
      backgroundColor: "red",
      textAlign: "center"
    };

    const regularButtonStyle = {
      padding: 8,
      margin: 8,
      borderRadius: 4,
      cursor: "pointer",
      textAlign: "center"
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

    const genOneFilter = (
      <div style={filterStyle} onClick={()=>{this.toggleFilter("toggle_gen_1");}}>
        {(filters.gen_1) ? (checked) : (unChecked)}
        <div>
          Gen 1
        </div>
      </div>
    );

    const genTwoFilter = (
      <div style={filterStyle} onClick={()=>{this.toggleFilter("toggle_gen_2");}}>
        {(filters.gen_2) ? (checked) : (unChecked)}
        <div>
          Gen 2
        </div>
      </div>
    );

    const genThreeFilter = (
      <div style={filterStyle} onClick={()=>{this.toggleFilter("toggle_gen_3");}}>
        {(filters.gen_3) ? (checked) : (unChecked)}
        <div>
          Gen 3
        </div>
      </div>
    );

    const menuStyle = {
      position: "absolute",
      top: 0,
      zIndex: 99,
      backgroundColor: "white",
      left: 0,
      width: "100%",
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
    };

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
            {navigationButton}
          </div>
          <div style={filterStyle}>
            <div onClick={()=>{
              this.setState({
                menuOpen: !menuOpen
              });
            }}>
              <span>
                Filters and More
              </span>
              {(menuOpen) ? (
                <span style={{paddingLeft: 8}}>
                  <FontAwesomeIcon icon={faAngleDown} />
                </span>
              ) : (
                <span style={{paddingLeft: 8}}>
                  <FontAwesomeIcon icon={faAngleRight} />
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={style}>

          {(menuOpen) ? (
            <div style={menuStyle}>
              <div style={{padding: 8}}>Filters:</div>
              <div style={{display: "flex", justifyContent: "center", flexWrap: "wrap"}}>
                {regularFilter}
                {shinyFilter}
                {specialFilter}
                {genOneFilter}
                {genTwoFilter}
                {genThreeFilter}
              </div>
              <div style={redButtonStyle} onClick={()=>{this.toPanel("removed");}}>View Removed Pokemon</div>
              <div style={redButtonStyle} onClick={this.clearAllRemovedPokemon}>Clear All Removed Pokemon</div>
              <div style={redButtonStyle} onClick={this.clearAllSelectedPokemon}>Clear All Selected Pokemon</div>
              <div style={regularButtonStyle} onClick={this.toggleXButtons}>{(options.showXButtons) ? ("Hide") : ("Show")} 'Remove Pokemon' Buttons</div>
            </div>
          ) : (null)}

          {shownPokemon}
        </div>
      </div>
    );
  }
}
