import React          from "react";
import PropTypes      from "prop-types";

import axios          from "axios";
import queryString    from "query-string";

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
    this.currentVersion = 11;
    this.state = {
      pokemon: [],
      collections: {
        default: {
          name: "My Collection",
          pokemon_ids: {}
        }
      },
      current_collection: "default",
      filters: {
        shiny: true,
        special: true,
        regular: true,
        additional_gender: false,
        gen_1: true,
        gen_2: true,
        gen_3: true,
        gen_4: true,
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
      featuresMenuOpen: false,
      contactMenuOpen: false,
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

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentWillMount = ()=>{

    if (localStorage.version){
      if (JSON.parse(localStorage.version) !== this.currentVersion){

        const hostname = window.location.hostname;
        const protocol = window.location.protocol;

        const host = (hostname === "localhost") ? (`${protocol}//${hostname}:${window.location.port}/pokemon`) : (`${protocol}//${hostname}/pokemon`);

        axios.get(host).then((response)=>{

          const oldPokemon = JSON.parse(localStorage.pokemon);

          const updatedPokemon = JSON.parse(response.data).map((pokemon, key)=>{
            return Object.assign({}, pokemon, oldPokemon[key]);
          });

          const filters= Object.assign({}, this.state.filters, JSON.parse(localStorage.filters));

          const options = Object.assign({}, this.state.options, JSON.parse(localStorage.options));

          this.setState({
            pokemon: updatedPokemon,
            filters,
            options
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

      const host = (hostname === "localhost") ? (`${protocol}//${hostname}:${window.location.port}/pokemon`) : (`${protocol}//${hostname}/pokemon`);

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

    const query = queryString.parse(this.props.location.search);
    if (query.collection_name){
      const current_pokemon = query.pokemon.split(",");
      this.setState({
        panel: "shared_collection",
        current_pokemon,
        shared_collection: {
          name: query.collection_name,
          pokemon: current_pokemon
        }
      })
    }
  };

  handlePokemonChange = (action, pokemon)=>{
    let newPokemon = JSON.parse(JSON.stringify(this.state.pokemon));

    switch (action){
      case "clearAllSelectedPokemon": {
        newPokemon = this.clearAllSelectedPokemon(newPokemon);
        break;
      }
      case "clearAllRemovedPokemon": {
        newPokemon = this.clearAllRemovedPokemon(newPokemon);
        break;
      }
      case "addRemovePokemon": {
        newPokemon = this.addRemovePokemon(newPokemon, pokemon.id);
        break;
      }
      case "toggleFullyRemovePokemon": {
        newPokemon = this.toggleFullyRemovePokemon(newPokemon, pokemon.id);
        break;
      }
    }

    this.setState({
      pokemon: newPokemon
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

  getSharingUrl = ()=>{

  };

  toggleFullyRemovePokemon = (pokemon, pokemon_id)=>{
    pokemon[pokemon_id].removed = !pokemon[pokemon_id].removed;
    return pokemon;
  };

  renderPokemon = (pokemon, key)=>{
    const { filters, options, searchedPokemon } = this.state;

    let dontRender = Object.keys(filters).some((filter, key)=>{

      if (!filters[filter]){//if filter is unchecked
        if (filter[4] == pokemon.gen){
          return true;
        } else if (pokemon[filter]){
          return true;
        }
      } else {
        return false;
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

    const weirdPokemonImageNames = [
      "pokemon_icon_026_61_01.png",
      "pokemon_icon_026_61_02.png",
      "pokemon_icon_026_61_02_shiny.png",
      "pokemon_icon_026_61_03.png",
      "pokemon_icon_026_61_03_shiny.png",
      "pokemon_icon_026_61_04.png",
      "pokemon_icon_026_61_04_shiny.png",
      "pokemon_icon_026_61_05.png",
      "pokemon_icon_026_61_05_shiny.png",
      "pokemon_icon_026_61_shiny.png",
      "pokemon_icon_386_12.png",
      "pokemon_icon_386_12_shiny.png",
      "pokemon_icon_386_13.png",
      "pokemon_icon_386_13_shiny.png",
      "pokemon_icon_386_14.png",
      "pokemon_icon_386_14_shiny.png",
      "pokemon_icon_487_12.png",
      "pokemon_icon_487_12_shiny.png",
    ];

    if (weirdPokemonImageNames.some((imageName)=>{return imageName == pokemon.image;})){
      return;
    }

    if (!pokemon.removed){
      return (
        <Pokemon
          key={key}
          pokemon={pokemon}
          onClick={(pokemon)=>{this.handlePokemonChange("addRemovePokemon", pokemon);}}
          toggleFullyRemovePokemon={(pokemon)=>{this.handlePokemonChange("toggleFullyRemovePokemon", pokemon);}}
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

  toggleFeatureMenu = ()=>{
    this.setState({
      featuresMenuOpen: !this.state.featuresMenuOpen
    });
  };

  toggleContactMenu = ()=>{
    this.setState({
      contactMenuOpen: !this.state.contactMenuOpen
    });
  };

  render(){
    const { panel, pokemon, filters, options, showNav, searchedPokemon, checked, unChecked, ArrowDown, ArrowRight, filtersMenuOpen, moreMenuOpen, aboutMenuOpen, contactMenuOpen, featuresMenuOpen, collections, current_collection } = this.state;

    const Filters = this.getFilters();

    let message;
    let searchbar;
    let shownPokemon;
    let navigationButton;
    if (panel === "removed"){
      message = <span style={{color: "red"}}>Removed Pokemon</span>;
      shownPokemon = pokemon.map(this.renderFullyRemovedPokemon);
      navigationButton = (
        <div style={styles.buttonStyle} onClick={()=>{this.toPanel("selecting");}}>Back</div>
      );
    } else if (panel === "selecting"){
      message = `Selecting for ${collections[current_collection].name}`;
      shownPokemon = pokemon.map(this.renderPokemon);
      navigationButton = (
        <div style={styles.buttonStyle} onClick={()=>{this.toPanel("done");}}>Done Selecting</div>
      );
      searchbar = (
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
      );
    } else if (panel === "shared_collection"){
      message = shared_collection.name;
      shownPokemon = pokemon.map(this.renderSelectedPokemon);
      navigationButton = (
        <div style={styles.buttonStyle} onClick={()=>{this.toPanel("selecting");}}>Back</div>
      );
    } else {
      message = collections[current_collection].name;
      shownPokemon = pokemon.map(this.renderSelectedPokemon);
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
                      Show Pokemon Not In Game Yet
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

              <div style={{padding: 8, fontSize: 16, borderBottom: (aboutMenuOpen) ? ("1px solid") : ("0px")}} onClick={this.toggleAboutMenu}>
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

              <div style={{padding: 8, borderBottom: "1px solid", borderTop: "1px solid", fontSize: 16}} onClick={this.toggleFeatureMenu}>
                Upcoming Features
                {(featuresMenuOpen) ? (ArrowDown) : (ArrowRight)}
              </div>

              {(featuresMenuOpen) ? (
                <div style={{padding: 8, lineHeight: 1.5}}>
                  - The ability to save specific collections and name them, not just one default collection.
                  <br/>
                  <br/>
                  - The ability to share collections via a url, not just by taking a screenshot of the collection or showing the collection to someone in person.
                  <br/>
                  <br/>
                  - The ability to search by pokemon's name
                  <br/>
                  <br/>
                  - Better gender sorting
                </div>
              ) : (null)}

              <div style={{padding: 8, fontSize: 16, borderTop: (featuresMenuOpen) ? ("1px solid") : ("0px"), borderBottom: (contactMenuOpen) ? ("1px solid") : ("0px")}} onClick={this.toggleContactMenu}>
                Contact
                {(contactMenuOpen) ? (ArrowDown) : (ArrowRight)}
              </div>

              {(contactMenuOpen) ? (
                <div style={{padding: 8, lineHeight: 1.5}}>
                  If you notice anything off, mistakes, bugs, or have suggestions for features (please take a look at the upcoming features list first), feel free to contact me at calebsundance3@gmail.com
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
            {searchbar}

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
