import React          from "react";
import PropTypes      from "prop-types";

import axios          from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faSquare }   from '@fortawesome/free-regular-svg-icons';

import SideNav        from 'react-simple-sidenav';

import nonLivePokemon from "./non-live-pokemon.js";
import liveShinys     from "./live-shinys.js";
import Pokemon        from "./components/Pokemon.js";

import styles         from "./styles.js";

export default class HomePage extends React.Component {

  constructor(props){
    super(props);
    this.currentVersion = 6;
    this.state = {
      pokemon: [],
      filters: {
        shiny: true,
        special: true,
        regular: true,
        additional_gender: false,
        gen_1: true,
        gen_2: true,
        gen_3: true,
      },
      panel: "selecting",
      options: {
        showXButtons: true,
        showAllShiny: false,
        showAllPokemon: false,
      },
      searchedPokemon: "",
      filtersMenuOpen: true,
      moreMenuOpen: false,
      aboutMenuOpen: false,
      checked: (
        <div style={{paddingRight: 8}}>
          <FontAwesomeIcon icon={faCheckSquare} />
        </div>
      ),
      unChecked: (
        <div style={{paddingRight: 8}}>
          <FontAwesomeIcon icon={faSquare} />
        </div>
      ),
      ArrowDown: (
        <span style={{paddingLeft: 8}}>
          <FontAwesomeIcon icon={faAngleDown} />
        </span>
      ),
      ArrowRight: (
        <span style={{paddingLeft: 8}}>
          <FontAwesomeIcon icon={faAngleRight} />
        </span>
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
            filters: (localStorage.filters) ? (JSON.parse(localStorage.filters)) : (this.state.filters), //not dynamically checking local storage versions
            options: (localStorage.options) ? (JSON.parse(localStorage.options)) : (this.state.options), //not dynamically checking local storage versions
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
    stupidUl.style.overflow = "auto";
    stupidUl.style.height = "100vh";
    stupidUl.style.listStyle = "none";
  };

  handlePokemonChange = (action, pokemon)=>{
    let newPokemon = JSON.parse(JSON.stringify(this.state.pokemon));

    switch (action){
      case "clearAllSelectedPokemon": {
        newPokemon = this.clearAllSelectedPokemon(newPokemon);
      }
      case "clearAllRemovedPokemon": {
        newPokemon = this.clearAllRemovedPokemon(newPokemon);
      }
      case "addRemovePokemon": {
        newPokemon = this.addRemovePokemon(newPokemon, pokemon.id);
      }
      case "toggleFullyRemovePokemon": {
        newPokemon = this.toggleFullyRemovePokemon(newPokemon, pokemon.id);
      }
    }

    this.setState({
      pokemon: newNewPokemon
    }, this.syncLocalStorage);
  };

  clearAllSelectedPokemon = (pokemon)=>{
    return pokemon.map((single_pokemon)=>{
      single_pokemon.selected = false;
      return single_pokemon;
    });
  };

  clearAllRemovedPokemon = (pokemon)=>{
    return pokemon.map((single_pokemon)=>{
      single_pokemon.removed = false;
      return single_pokemon;
    });
  };

  addRemovePokemon = (pokemon, pokemon_id)=>{
    pokemon[pokemon_id].selected = !pokemon[pokemon_id].selected;
    return pokemon;
  };

  toggleFullyRemovePokemon = (pokemon, pokemon_id)=>{
    pokemon[pokemon_id].removed = !pokemon[pokemon_id].removed;
    return pokemon;
  };

  renderPokemon = (pokemon, key)=>{
    const { filters, options, searchedPokemon } = this.state;

    let dontRender = Object.keys(filters).some((filter, key)=>{
      if (!filters[filter]){
        if (filter[4] === pokemon.gen){
          return true;
        } else if (pokemon[filter]){
          return true;
        }
      }
    });

    if (dontRender){
      return;
    }

    if (!options.showAllShiny && pokemon.shiny){
      if (!liveShinys.some((pokemonNumber)=>{return pokemonNumber == pokemon.number;})){
        return;
      }
    }

    if (!options.showAllPokemon){
      if (nonLivePokemon.some((pokemonNumber)=>{return pokemonNumber == pokemon.number;})){
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
        return;
      }
    }

    if (!pokemon.removed){
      return (
        <Pokemon
          key={key}
          pokemon={pokemon}
          onClick={(pokemon)=>{this.handlePokemonChange("addRemovePokemon", pokemon);}}
          toggleFullyRemovePokemon={(pokemon)=>{this.handlePokemonChange("toggleFullyRemovePokemon");}}
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
          onClick={(pokemon)=>{this.handlePokemonChange("addRemovePokemon");}}
          toggleFullyRemovePokemon={(pokemon)=>{this.handlePokemonChange("toggleFullyRemovePokemon", pokemon);}}
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
          onClick={(pokemon)=>{this.handlePokemonChange("addRemovePokemon", pokemon);}}
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

  toggleFilter = (toggled_filter)=>{

    const filters = Object.assign({}, this.state.filters);
    let state = {filters};

    Object.keys(filters).some((filter)=>{
      if (toggled_filter === filter){
        state.filters[filter] = !state.filters[filter];
        return true;
      }
    });

    this.setState(state, this.syncLocalStorage);

  };

  syncLocalStorage = ()=>{
    const { pokemon, filters, options } = this.state;

    localStorage.pokemon = JSON.stringify(pokemon);
    localStorage.filters = JSON.stringify(filters);
    localStorage.options = JSON.stringify(options);
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

  toggleAllPokemon = ()=>{
    let state = {};
    state.options = Object.assign({}, this.state.options);
    state.options.showAllPokemon = !this.state.options.showAllPokemon;
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
      let additionalStyle = {};

      if (filter[3] == "_"){//for the "Gen x" filters
        let newFilterName = filter;
        newFilterName = newFilterName.substr(0, 3) + " " + newFilterName.substr(3 + " ".length);
        filterName = newFilterName.charAt(0).toUpperCase() + newFilterName.slice(1);
      } else if (filter[10] == "_"){
        filterName = "Additional Genders";
        additionalStyle.width = "100%";
      } else {
        filterName = filter.charAt(0).toUpperCase() + filter.slice(1);
      }

      return (
        <div key={key} style={{...styles.filterStyle, ...additionalStyle}} onClick={()=>{this.toggleFilter(filter);}}>
          {(filters[filter]) ? (checked) : (unChecked)}
          <div style={{paddingTop: 1}}>
            {filterName}
          </div>
        </div>
      );
    });

  };

  toggleFilterMenu = ()=>{
    this.setState({
      filtersMenuOpen: !this.state.filtersMenuOpen
    });
  };

  toggleMoreMenu = ()=>{
    this.setState({
      moreMenuOpen: !this.state.moreMenuOpen
    });
  };

  toggleAboutMenu = ()=>{
    this.setState({
      aboutMenuOpen: !this.state.aboutMenuOpen
    });
  };

  render(){
    const { panel, pokemon, filters, options, showNav, searchedPokemon, checked, unChecked, ArrowDown, ArrowRight, filtersMenuOpen, moreMenuOpen, aboutMenuOpen } = this.state;

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

              <div style={{padding: 8, fontSize: 16}} onClick={this.toggleFilterMenu}>
                Filters
                {(filtersMenuOpen) ? (ArrowDown) : (ArrowRight)}
              </div>

              {(filtersMenuOpen) ? (
                <div style={{display: "flex", flexWrap: "wrap"}}>
                  {Filters}
                </div>
              ) : (null)}

              <div style={{padding: 8, borderBottom: "1px solid", borderTop: "1px solid", fontSize: 16}} onClick={this.toggleMoreMenu}>
                More
                {(moreMenuOpen) ? (ArrowDown) : (ArrowRight)}
              </div>

              {(moreMenuOpen) ? (
                <div style={{borderBottom: "1px solid"}}>
                  <div style={styles.regularButtonStyle} onClick={this.toggleXButtons}>
                    {(options.showXButtons) ? (checked) : (unChecked)}
                    <span style={{paddingTop: 1}}>
                      Show 'Remove Pokemon' Buttons
                    </span>
                  </div>
                  <div style={styles.regularButtonStyle} onClick={this.toggleAllPokemon}>
                    {(options.showAllPokemon) ? (checked) : (unChecked)}
                    <span style={{paddingTop: 1}}>
                      Show Pokemon From Gen 3 Not In Game Yet
                    </span>
                  </div>
                  <div style={styles.regularButtonStyle} onClick={this.toggleAllShiny}>
                    {(options.showAllShiny) ? (checked) : (unChecked)}
                    <span style={{paddingTop: 1}}>
                      Show Shiny Pokemon Not In Game Yet
                    </span>
                  </div>
                  <div style={styles.redButtonStyle} onClick={()=>{
                      this.setState({
                        showNav: false
                      }, ()=>{
                        this.toPanel("removed");
                      });
                    }}>View Removed Pokemon</div>
                  <div style={styles.redButtonStyle} onClick={()=>{this.handlePokemonChange("clearAllRemovedPokemon");}}>Clear All Removed Pokemon</div>
                    <div style={styles.redButtonStyle} onClick={()=>{this.handlePokemonChange("clearAllSelectedPokemon");}}>Clear All Selected Pokemon</div>
                </div>
              ) : (null)}

              <div style={{padding: 8, fontSize: 16}} onClick={this.toggleAboutMenu}>
                About
                {(aboutMenuOpen) ? (ArrowDown) : (ArrowRight)}
              </div>

              {(aboutMenuOpen) ? (
                <div style={{padding: 8, lineHeight: 1.5}}>
                  Pogo Collector is a tool for helping show friends what Pokemon you are looking for in Pokemon Go! This app remembers your Pokemon selections* and the filters you have active.
                  <br/>
                  <br/>
                  *Unless you clear your browser's data / cache
                </div>
              ) : (null)}

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
