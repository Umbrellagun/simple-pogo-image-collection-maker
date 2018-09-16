import React     from "react";
import PropTypes from "prop-types";

import axios     from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';

import SideNav   from 'react-simple-sidenav';

import Thing from "./live-shinys.js";
import Pokemon   from "./components/Pokemon.js";

import styles    from "./styles.js";

// <div style={styles.filterStyle}>
//   <div onClick={this.toggleOptionsModal}>
//     <span>
//       Filters and More
//     </span>
//     {(menuOpen) ? (
//       <span style={{paddingLeft: 8}}>
//         <FontAwesomeIcon icon={faAngleDown} />
//       </span>
//     ) : (
//       <span style={{paddingLeft: 8}}>
//         <FontAwesomeIcon icon={faAngleRight} />
//       </span>
//     )}
//   </div>
// </div>

export default class HomePage extends React.Component {

  constructor(props){
    super(props);
    this.currentVersion = 3;
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
      options: {
        showXButtons: true,
        showAllShiny: false,
      },
      searchedPokemon: "",
      checked: (
        <div style={{paddingRight: 8}}>
          <FontAwesomeIcon icon={faCheckSquare} />
        </div>
      ),
      unChecked: (
        <div style={{paddingRight: 8}}>
          <FontAwesomeIcon icon={faSquare} />
        </div>
      )
    };
  }

  componentWillMount = ()=>{

    if (localStorage.version){
      if (JSON.parse(localStorage.version) !== this.currentVersion){
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;

        const host = (hostname === "localhost") ? (`${protocol}//${hostname}:${process.env.PORT}/pokemon`) : (`${protocol}//${hostname}/pokemon`);

        axios.get(host).then((response)=>{
          const oldPokemon = JSON.parse(localStorage.pokemon);

          const updatedPokemon = JSON.parse(response.data).map((pokemon, key)=>{
            return Object.assign({}, pokemon, oldPokemon[key]);
          });

          this.setState({
            pokemon: updatedPokemon,
            filters: (localStorage.filters) ? (JSON.parse(localStorage.filters)) : (this.state.filters),
            options: (localStorage.options) ? (JSON.parse(localStorage.options)) : (this.state.options),
          }, this.syncLocalStorage);

        }).catch((error)=>{
          console.log(error);
        });

      } else {
        this.setState({
          pokemon: JSON.parse(localStorage.pokemon),
          filters: JSON.parse(localStorage.filters),
          options: JSON.parse(localStorage.options),
        });
      }
    } else {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;

      const host = (hostname === "localhost") ? (`${protocol}//${hostname}:${process.env.PORT}/pokemon`) : (`${protocol}//${hostname}/pokemon`);

      axios.get(host).then((response)=>{
        this.setState({
          pokemon: JSON.parse(response.data)
        }, this.syncLocalStorage);
      }).catch((error)=>{
        console.log(error);
      });
    }
  };

  componentDidMount = ()=>{
    let stupidUl = document.getElementsByTagName("ul")[0];
    stupidUl.style.padding = 0;
    stupidUl.style.margin = 0;
    stupidUl.style.listStyle = "none";
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
    const { filters, options, searchedPokemon } = this.state;

    if (!filters.shiny){
      if (pokemon.shiny){
        return;
      }
    }

    if (!filters.special){
      if (pokemon.special){
        return;
      }
    }

    if (!filters.regular){
      if (pokemon.regular){
        return;
      }
    }

    if (!filters.gen_1){
      if (pokemon.gen == 1){
        return;
      }
    }

    if (!filters.gen_2){
      if (pokemon.gen == 2){
        return;
      }
    }

    if (!filters.gen_3){
      if (pokemon.gen == 3){
        return;
      }
    }

    if (!options.showAllShiny && pokemon.shiny){
      if (!Thing.some((pokemonNumber)=>{return pokemonNumber == pokemon.number;})){
        return;
      }
    }

    let stringCheck = true;
    if (searchedPokemon != ""){

      let searchedPokemonNumber;
      if (searchedPokemon.length == 3){
        searchedPokemonNumber = searchedPokemon;
      } else if (searchedPokemon.length == 2){
        searchedPokemonNumber = "0" + searchedPokemon;
      } else {
        searchedPokemonNumber = "00" + searchedPokemon;
      }

      if (pokemon.number != searchedPokemonNumber){
        stringCheck = false;
      }
    }

    if (!pokemon.removed){
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

  toggleAllShiny = ()=>{
    let state = {};
    state.options = Object.assign({}, this.state.options);
    state.options.showAllShiny = !this.state.options.showAllShiny;
    this.setState(state);
  };

  onChange = (e)=>{
    const state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  getFilters = ()=>{
    const { checked, unChecked, filters } = this.state;

    return Object.keys(filters).map((filter, key)=>{
      let filterName;

      if (filter[3] == "_" ){
        let newFilterName = filter;
        newFilterName = newFilterName.substr(0, 3) + " " + newFilterName.substr(3 + " ".length);
        filterName = newFilterName.charAt(0).toUpperCase() + newFilterName.slice(1);
      } else {
        filterName = filter.charAt(0).toUpperCase() + filter.slice(1);
      }

      return (
        <div key={key} style={styles.filterStyle} onClick={()=>{this.toggleFilter(`toggle_${filter}`);}}>
          {(filters[filter]) ? (checked) : (unChecked)}
          <div>
            {filterName}
          </div>
        </div>
      );
    });

  };

  render(){
    const { panel, pokemon, filters, options, showNav, searchedPokemon, checked, unChecked } = this.state;

    const Filters = this.getFilters();

    let message;
    let shownPokemon;
    let navigationButton;
    if (panel === "done"){
      message = "These are your selected Pokemon";
      shownPokemon = pokemon.map(this.renderSelectedPokemon);
      navigationButton = (
        <div style={styles.buttonStyle} onClick={()=>{this.toPanel("selecting");}}>Back</div>
      );
    } else if (panel === "selecting"){
      message = "Select the Pokemon you would like";
      shownPokemon = pokemon.map(this.renderPokemon);
      navigationButton = (
        <div style={styles.buttonStyle} onClick={()=>{this.toPanel("done");}}>Done Selecting</div>
      );
    } else if (panel === "removed"){
      message = <span style={{color: "red"}}>Removed Pokemon</span>;
      shownPokemon = pokemon.map(this.renderFullyRemovedPokemon);
      navigationButton = (
        <div style={styles.buttonStyle} onClick={()=>{this.toPanel("selecting");}}>Back</div>
      );
    }

    return (
      <div style={styles.containerStyle}>

        <svg
          onClick={() => this.setState({showNav: true})}
          fill="darkcyan"
          xmlns="http://www.w3.org/2000/svg"
          cursor="pointer"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          style={{position: 'absolute', top: 0, left: 0, padding: 16}}
        >
          <path d="M0 0h24v24H0z" fill="none"></path>
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
        </svg>

        <SideNav
          showNav={showNav}
          onHideNav={() => this.setState({showNav: false})}
          title="PoGo Collector"
          items={[
            <div style={styles.menuStyle}>
              <div style={{padding: 8}}>Filters:</div>
              <div style={{display: "flex", flexWrap: "wrap"}}>
                {Filters}
              </div>
              <div style={{padding: 8}}>More:</div>
              <div style={styles.regularButtonStyle} onClick={this.toggleXButtons}>
                {(options.showXButtons) ? (checked) : (unChecked)} Show 'Remove Pokemon' Buttons
              </div>
              <div style={styles.regularButtonStyle} onClick={this.toggleAllShiny}>
                {(options.showAllShiny) ? (checked) : (unChecked)} Show Shiny Pokemon Not In Game
              </div>
              <div style={styles.redButtonStyle} onClick={()=>{
                  this.setState({
                    showNav: false
                  }, ()=>{
                    this.toPanel("removed");
                  });
                }}>View Removed Pokemon</div>
              <div style={styles.redButtonStyle} onClick={this.clearAllRemovedPokemon}>Clear All Removed Pokemon</div>
              <div style={styles.redButtonStyle} onClick={this.clearAllSelectedPokemon}>Clear All Selected Pokemon</div>
            </div>
          ]}
          navStyle={styles.navStyle}
          titleStyle={styles.navTitleStyle}
          itemStyle={styles.navItemStyle}
          itemHoverStyle={styles.navItemHoverStyle}
        />

      <div style={styles.header}>
          <div style={{fontSize: 21, marginTop: 16}}>
            PoGo Collector
          </div>
          <div style={{marginTop: 8}}>
            {message}
          </div>
          <div style={{display: "flex", width: "100%"}}>
            <label for="searchedPokemon" style={{display: "none"}}>Search by Pokemon #</label>
            <input
              placeholder="Search by Pokemon #"
              style={styles.inputStyle}
              name="searchedPokemon"
              ref="searchedPokemon"
              id="searchedPokemon"
              type="text"
              value={searchedPokemon}
              onChange={this.onChange}
              />
            <div style={styles.buttonsStyle}>
              {navigationButton}
            </div>
          </div>
        </div>
        <div style={styles.style}>
          {shownPokemon}
        </div>
      </div>
    );
  }
}
