import React          from "react";
import PropTypes      from "prop-types";

import Modal          from "react-modal";

import axios          from "axios";
import queryString    from "query-string";
import copy           from "copy-to-clipboard";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faAngleDown, faAngleRight, faPencilAlt, faShareAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSquare }   from '@fortawesome/free-regular-svg-icons';

import SideNav        from 'react-simple-sidenav';

import nonLivePokemon from "./non-live-pokemon.js";
import liveShinys     from "./live-shinys.js";
import Pokemon        from "./components/Pokemon.js";

import styles         from "./styles.js";

export default class HomePage extends React.Component {

  constructor(props){
    super(props);
    this.currentVersion = 19;
    this.state = {
      pokemon: [],
      collections: {
        default: {
          name: "My Collection",
          pokemon_ids: {}
        }
      },
      removed_pokemon: {},
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
      dropdownOpen: false,
      deleted: false,
      copied: false,
      focused_collection: "default",
      deleteCollectionModal: false,
      shareCollectionModal: false,
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

          const oldPokemon = JSON.parse(localStorage.getItem("pokemon"));

          const updatedPokemon = JSON.parse(response.data).map((pokemon, key)=>{
            if (pokemon.number === "453"){
              if (pokemon.shiny){
                return Object.assign({}, pokemon, oldPokemon[key], {image: "pokemon_icon_453_00_shiny.png", id: "453_00", additional_gender: false});
              } else {
                return Object.assign({}, pokemon, oldPokemon[key], {image: "pokemon_icon_453_00.png", id: "453_00_shiny", additional_gender: false});
              }
            } else {
              return Object.assign({}, pokemon, oldPokemon[key]);
            }
          });

          const filters = Object.assign({}, this.state.filters, JSON.parse(localStorage.getItem("filters")));

          const options = Object.assign({}, this.state.options, JSON.parse(localStorage.getItem("options")));

          const collections = Object.assign({}, this.state.collections, JSON.parse(localStorage.getItem("collections")));

          const removed_pokemon = JSON.parse(localStorage.getItem("removed_pokemon")) || {};

          const current_collection =  JSON.parse(localStorage.getItem("current_collection")) || "default";

          this.setState({
            pokemon: updatedPokemon,
            filters,
            options,
            removed_pokemon,
            collections,
            current_collection
          }, ()=>{
            localStorage.pokemon = JSON.stringify(this.state.pokemon);
            this.syncLocalStorage();
          });

        }).catch((error)=>{
          console.log(error);
        });

      } else {
        this.setState({
          pokemon: JSON.parse(localStorage.getItem("pokemon")),
          filters: JSON.parse(localStorage.getItem("filters")),
          options: JSON.parse(localStorage.getItem("options")),
          collections: JSON.parse(localStorage.getItem("collections")),
          removed_pokemon: JSON.parse(localStorage.getItem("removed_pokemon")),
          current_collection: JSON.parse(localStorage.getItem("current_collection"))
        });
      }
    } else {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;

      const host = (hostname === "localhost") ? (`${protocol}//${hostname}:${window.location.port}/pokemon`) : (`${protocol}//${hostname}/pokemon`);

      axios.get(host).then((response)=>{
        this.setState({
          pokemon: JSON.parse(response.data)
        }, ()=>{
          localStorage.pokemon = JSON.stringify(this.state.pokemon);
        });
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
      let current_pokemon = {};
      query.pokemon.split(",").forEach((pokemon_id)=>{
        current_pokemon[pokemon_id] = pokemon_id;
      });
      this.setState({
        panel: "shared_collection",
        current_pokemon,
        shared_collection: {
          name: query.collection_name,
          pokemon_ids: current_pokemon
        }
      })
    }
  };

  handlePokemonChange = (action, pokemon)=>{
    let new_collections;
    let new_removed_pokemon;

    switch (action){
      case "clearAllSelectedPokemon": {
        new_collections = JSON.parse(JSON.stringify(this.state.collections));
        new_collections = this.clearAllSelectedPokemon(new_collections);
        break;
      }
      case "clearAllRemovedPokemon": {
        new_removed_pokemon = {};
        break;
      }
      case "addRemovePokemon": {
        new_collections = JSON.parse(JSON.stringify(this.state.collections));
        new_collections = this.addRemovePokemon(new_collections, pokemon.id);
        break;
      }
      case "toggleFullyRemovePokemon": {
        new_removed_pokemon = JSON.parse(JSON.stringify(this.state.removed_pokemon));
        new_removed_pokemon = this.toggleFullyRemovePokemon(new_removed_pokemon, pokemon.id);
        break;
      }
    }

    let state;
    if (new_collections){
      state = {
        collections: new_collections,
      };
    } else {
      state = {
        removed_pokemon: new_removed_pokemon
      };
    }

    this.setState(state, this.syncLocalStorage);
  };

  clearAllSelectedPokemon = (new_collections)=>{
    const { current_collection } = this.state;

    new_collections[current_collection].pokemon_ids = {};

    return new_collections;
  };

  addRemovePokemon = (new_collections, pokemon_id)=>{
    const { current_collection } = this.state;

    if (new_collections[current_collection].pokemon_ids[pokemon_id]){
      delete new_collections[current_collection].pokemon_ids[pokemon_id];
    } else {
      new_collections[current_collection].pokemon_ids[pokemon_id] = pokemon_id;
    }

    return new_collections;
  };

  toggleFullyRemovePokemon = (new_removed_pokemon, pokemon_id)=>{

    if (new_removed_pokemon[pokemon_id]){
      delete new_removed_pokemon[pokemon_id];
    } else {
      new_removed_pokemon[pokemon_id] = pokemon_id;
    }

    return new_removed_pokemon;
  };

  renderPokemon = (pokemon, key)=>{
    const { filters, options, searchedPokemon, collections, current_collection, removed_pokemon } = this.state;

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

    if (!removed_pokemon[pokemon.id]){
      return (
        <Pokemon
          key={key}
          pokemon={pokemon}
          selected={collections[current_collection].pokemon_ids[pokemon.id]}
          onClick={(pokemon)=>{this.handlePokemonChange("addRemovePokemon", pokemon);}}
          toggleFullyRemovePokemon={(pokemon)=>{this.handlePokemonChange("toggleFullyRemovePokemon", pokemon);}}
          showFullyRemoveButton={(options.showXButtons) ? (true) : (false)}
        />
      );
    }

  };

  renderFullyRemovedPokemon = (pokemon, key)=>{
    const { collections, current_collection, removed_pokemon } = this.state;

    if (removed_pokemon[pokemon.id]){
      return (
        <Pokemon
          key={key}
          pokemon={pokemon}
          selected={collections[current_collection].pokemon_ids[pokemon.id]}
          onClick={(pokemon)=>{this.handlePokemonChange("addRemovePokemon");}}
          toggleFullyRemovePokemon={(pokemon)=>{this.handlePokemonChange("toggleFullyRemovePokemon", pokemon);}}
          showFullyRemoveButton={true}
        />
      );
    }
  }

  renderSelectedPokemon = (pokemon, key)=>{
     const { collections, current_collection } = this.state;

    if (collections[current_collection].pokemon_ids[pokemon.id]){
      return (
        <Pokemon
          key={key}
          pokemon={pokemon}
          selected={collections[current_collection].pokemon_ids[pokemon.id]}
          onClick={(pokemon)=>{this.handlePokemonChange("addRemovePokemon", pokemon);}}
          selectedScreen={true}
        />
      );
    }
  }

  renderSharedPokemon = (pokemon, key)=>{
    const { shared_collection } = this.state;

    if (shared_collection.pokemon_ids[pokemon.id]){
      return (
        <Pokemon
          key={key}
          pokemon={pokemon}
          selected={false}
          onClick={()=>{}}
          selectedScreen={true}
        />
      );
    }
  };

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
    const { pokemon, filters, options, collections, current_collection, removed_pokemon } = this.state;

    // localStorage.pokemon = JSON.stringify(pokemon);
    localStorage.filters = JSON.stringify(filters);
    localStorage.options = JSON.stringify(options);
    localStorage.removed_pokemon = JSON.stringify(removed_pokemon);
    localStorage.collections = JSON.stringify(collections);
    localStorage.current_collection = JSON.stringify(current_collection);
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

  dropdownToggle = ()=>{
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };

  collectionNameChange = (e)=>{
    const { collections, current_collection } = this.state;

    const state = {
      collections: {
        ...collections,
        [current_collection]: Object.assign({}, collections[current_collection], {name: e.target.value || ""})
      }
    };

    this.setState(state, this.syncLocalStorage);
  };

  addNewCollection = ()=>{
    this.setState({
      collections: Object.assign({}, this.state.collections, {
        [Date.now()]: {
          name: "New Collection",
          pokemon_ids: {}
        }
      })
    }, this.syncLocalStorage)
  };

  openDeleteCollectionModal = (focused_collection)=>{
    this.setState({
      deleteCollectionModal: true,
      focused_collection
    });
  };

  openShareCollectionModal = (focused_collection)=>{
    this.setState({
      shareCollectionModal: true,
      focused_collection
    });
  };

  getDeleteCollectionModal = ()=>{
    const { deleteCollectionModal, deleted, collections, focused_collection } = this.state;

    return (
      <Modal
        isOpen={deleteCollectionModal}
        closeTimeoutMS={150}
        onRequestClose={()=>{
          this.setState({
            deleteCollectionModal: false
          });
        }}
      >
        <div>
          {(deleted) ? (
            <div style={{color: "red", textAlign: "center"}}>Collection Deleted!</div>
          ) : (
            <div>
              <div style={styles.closeX}>
                <FontAwesomeIcon onClick={()=>{
                  this.setState({
                    deleteCollectionModal: false,
                    deleted: false,
                  });
                }} icon={faTimes} />
              </div>
              <div style={{marginTop: 16, textAlign: "center"}}>Are you sure you want to delete the {(collections[focused_collection]) ? (collections[focused_collection].name) : (null)} collection?</div>
              <div className="shadow" style={{...styles.buttonStyle, marginTop: 16, marginBottom: 16, backgroundColor: "red", fontWeight: 600, fontSize: 16}} onClick={this.deleteCollection}>DELETE</div>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  getShareCollectionModal = ()=>{
    const { shareCollectionModal, focused_collection, collections, copied } = this.state;

    let url = "";
    if (collections[focused_collection]){
      url = this.getSharingUrl();
    }

    return (
      <Modal
        isOpen={shareCollectionModal}
        closeTimeoutMS={150}
        onRequestClose={()=>{
          this.setState({
            shareCollectionModal: false,
            copied: false,
          });
        }}
      >
        <div>
          <div style={styles.closeX}>
            <FontAwesomeIcon onClick={()=>{
              this.setState({
                shareCollectionModal: false,
                copied: false,
              });
            }} icon={faTimes} />
          </div>
          <div className="shadow" style={{...styles.buttonStyle, marginTop: 16, marginBottom: 16, fontWeight: 600}} onClick={()=>{
            copy(url);

            this.setState({
              copied: true
            });
          }}>Copy Link</div>
        {(copied) ? (<div style={{color: "red", marginBottom: 8}}>Link Copied!</div>) : (null)}
          <div style={{wordWrap: "break-word"}}>{url}</div>
        </div>
      </Modal>
    );
  };

  deleteCollection = ()=>{//cleanup
    const { focused_collection, collections } = this.state;

    let new_collections = Object.assign({}, collections);

    delete new_collections[focused_collection];

    this.setState({
      collections: new_collections,
      deleted: true
    }, ()=>{

      this.syncLocalStorage();

      setTimeout(()=>{
        this.setState({
          deleteCollectionModal: false
        }, ()=>{
          setTimeout(()=>{
            this.setState({
              deleted: false
            })
          }, 1000)
        });
      }, 2000);
    });
  };

  getSharingUrl = ()=>{
    const { focused_collection, collections } = this.state;

    let url = `https://pogocollector.com/?collection_name=${collections[focused_collection].name}&pokemon=`;

    Object.keys(collections[focused_collection].pokemon_ids).forEach((id, key)=>{
      const comma = (key !== 0) ? (",") : ("");
      url = `${url}${comma}${id}`;
    });

    return url;
  };

  addSharedCollection = ()=>{
    const { shared_collection } = this.state;

    const new_collection_id = Date.now();

    this.setState({
      collections: Object.assign({}, this.state.collections, {
        [new_collection_id]: {
          name: shared_collection.name,
          pokemon_ids: shared_collection.pokemon_ids
        }
      })
    }, ()=>{
      this.context.router.history.replace("");

      this.setState({
        panel: "done",
        current_collection: new_collection_id
      });
    }, this.syncLocalStorage)
  };

  render(){
    const { panel, pokemon, filters, options, showNav, searchedPokemon, checked, unChecked, ArrowDown, ArrowRight, filtersMenuOpen, moreMenuOpen, aboutMenuOpen, contactMenuOpen, featuresMenuOpen, collections, current_collection, dropdownOpen, editingName, shared_collection } = this.state;

    const Filters = this.getFilters();

    let DropdownMenu;
    let searchbar;
    let shownPokemon;
    let navigationButton;
    if (panel === "removed"){
      DropdownMenu = <span style={{color: "red"}}>Removed Pokemon</span>;
      shownPokemon = pokemon.map(this.renderFullyRemovedPokemon);
      navigationButton = (
        <div className="shadow" style={styles.buttonStyle} onClick={()=>{this.toPanel("selecting");}}>Back</div>
      );
    } else if (panel === "selecting"){//refactor these DropdownMenu's code to combine them
      DropdownMenu = (
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%"}}>
          <div onClick={()=>{
              this.setState({
                editingName: !editingName
              });
            }} style={{paddingRight: 8}}>
            <FontAwesomeIcon icon={faPencilAlt} />
          </div>
          <div style={{marginRight: 8}}>Selecting for </div>
          <div style={{display: "flex", alignItems: "center"}}>
            <div>
              {(editingName) ? (
                <input
                  name='collection-name'
                  style={styles.inputStyle}
                  onChange={this.collectionNameChange} value={collections[current_collection].name}
                />
              ) : (
                collections[current_collection].name
              )}
            </div>
            <div onClick={this.dropdownToggle}>
              {(dropdownOpen) ? (ArrowDown) : (ArrowRight)}
            </div>
            {(dropdownOpen) ? (
              <div className="shadow" style={styles.dropdownMenuStyle}>
                {Object.keys(collections).map((key)=>{
                  return (
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                      <div style={{padding: 4}} onClick={()=>{
                        this.setState({
                          current_collection: key,
                          dropdownOpen: false
                        })
                      }}>{collections[key].name}</div>
                    <div>
                        <FontAwesomeIcon onClick={()=>{this.openShareCollectionModal(key);}} style={{paddingLeft: 4, paddingRight: 16}} icon={faShareAlt} />
                        <FontAwesomeIcon onClick={()=>{this.openDeleteCollectionModal(key);}} icon={faTimes} />
                      </div>
                    </div>
                  );
                })}
                <div style={{padding: 4}} onClick={this.addNewCollection}>+ New Collection</div>
              </div>
            ) : (null)}
          </div>
        </div>
      );
      shownPokemon = pokemon.map(this.renderPokemon);
      navigationButton = (
        <div className="shadow" style={styles.buttonStyle} onClick={()=>{this.toPanel("done");}}>View Selected</div>
      );
      searchbar = (
        <input
          placeholder="Search by Pokemon #"
          style={{...styles.inputStyle, width: "100%"}}
          name="searchedPokemon"
          ref="searchedPokemon"
          id="searchedPokemon"
          type="text"
          value={searchedPokemon}
          onChange={this.onChange}
        />
      );
    } else if (panel === "shared_collection"){
      DropdownMenu = shared_collection.name;
      shownPokemon = pokemon.map(this.renderSharedPokemon);
      navigationButton = (
        <div className="shadow" style={styles.buttonStyle} onClick={()=>{this.toPanel("selecting");}}>Back</div>
      );
      searchbar = (
        <div className="shadow" style={{...styles.buttonStyle, marginLeft: 0, width: "100%"}} onClick={this.addSharedCollection}>Add Collection</div>
      );
    } else {//refactor these DropdownMenu's code to combine them
      DropdownMenu = (
        <div>
          <span onClick={()=>{
              this.setState({
                editingName: !editingName
              });
            }} style={{paddingRight: 8}}>
            <FontAwesomeIcon icon={faPencilAlt} />
          </span>
          <span>
            <span>
              <span>
                {(editingName) ? (
                  <input
                    name='collection-name'
                    style={styles.inputStyle}
                    onChange={this.collectionNameChange} value={collections[current_collection].name}
                  />
                ) : (
                  collections[current_collection].name
                )}
              </span>
              <span onClick={this.dropdownToggle}>
                {(dropdownOpen) ? (ArrowDown) : (ArrowRight)}
              </span>
              {(dropdownOpen) ? (
                <div className="shadow" style={styles.dropdownMenuStyle}>
                  {Object.keys(collections).map((key)=>{
                    return (
                      <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div style={{padding: 4}} onClick={()=>{
                            this.setState({
                              current_collection: key,
                              dropdownOpen: false
                            })
                          }}>{collections[key].name}</div>
                        <span>
                          <FontAwesomeIcon onClick={()=>{this.openShareCollectionModal(key);}} style={{paddingLeft: 4, paddingRight: 16}} icon={faShareAlt} />
                          <FontAwesomeIcon onClick={()=>{this.openDeleteCollectionModal(key);}} icon={faTimes} />
                        </span>
                      </div>
                    );
                  })}
                  <div style={{padding: 4}} onClick={this.addNewCollection}>+ New Collection</div>
                </div>
              ) : (null)}
            </span>
          </span>

        </div>
      );
      shownPokemon = pokemon.map(this.renderSelectedPokemon);
      navigationButton = (
        <div className="shadow" style={styles.buttonStyle} onClick={()=>{this.toPanel("selecting");}}>Back</div>
      );
    }

    const DeleteCollectionModal = this.getDeleteCollectionModal();
    const ShareCollectionModal = this.getShareCollectionModal();

    const closeThingsBackground = (dropdownOpen) ? (
      <div style={{position: "fixed", left: 0, right: 0, top: 0, bottom: 0, background: "rgba(0, 0, 0, 0)", zIndex: 1}} onClick={()=>{
        this.setState({
          dropdownOpen: false
        });
      }}></div>
    ) : (null);

    return (
      <div style={styles.containerStyle}>

        {DeleteCollectionModal}
        {ShareCollectionModal}

        {closeThingsBackground}

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
                    <span style={{paddingTop: 1, textAlign: "left"}}>
                      Show 'Remove Pokemon' Buttons
                    </span>
                  </div>
                  <div style={styles.regularButtonStyle} onClick={this.toggleAllPokemon}>
                    {(options.showAllPokemon) ? (checked) : (unChecked)}
                    <span style={{paddingTop: 1, textAlign: "left"}}>
                      Show Pokemon Not In Game Yet
                    </span>
                  </div>
                  <div style={styles.regularButtonStyle} onClick={this.toggleAllShiny}>
                    {(options.showAllShiny) ? (checked) : (unChecked)}
                    <span style={{paddingTop: 1, textAlign: "left"}}>
                      Show Shiny Pokemon Not In Game Yet
                    </span>
                  </div>
                  <div className="shadow" style={styles.redButtonStyle} onClick={()=>{
                      this.setState({
                        showNav: false
                      }, ()=>{
                        this.toPanel("removed");
                      });
                    }}>View Removed Pokemon</div>
                  <div className="shadow" style={styles.redButtonStyle} onClick={()=>{this.handlePokemonChange("clearAllRemovedPokemon");}}>Clear All Removed Pokemon</div>
                  <div className="shadow" style={styles.redButtonStyle} onClick={()=>{this.handlePokemonChange("clearAllSelectedPokemon");}}>Clear All Current Collection's Selected Pokemon</div>
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

          <div style={styles.dropdownTriggerStyle}>
            {DropdownMenu}
          </div>

          <div style={{display: "flex", width: "100%", minHeight: 48}}>
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
