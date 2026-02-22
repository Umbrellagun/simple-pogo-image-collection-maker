import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Modal from "react-modal";

import queryString from "query-string";

import SideNav from 'react-simple-sidenav';

import nonLivePokemon from "./non-live-pokemon";
import liveShinys from "./live-shinys";
import Pokemon from "./components/Pokemon.jsx";
import FilterPanel from "./components/FilterPanel.jsx";
import MoreMenu from "./components/MoreMenu.jsx";
import AboutMenu from "./components/AboutMenu.jsx";
import FeaturesMenu from "./components/FeaturesMenu.jsx";
import ContactMenu from "./components/ContactMenu.jsx";
import CollectionDropdown from "./components/CollectionDropdown.jsx";
import DeleteCollectionModal from "./components/DeleteCollectionModal.jsx";
import ShareCollectionModal from "./components/ShareCollectionModal.jsx";
import { ArrowDownIcon, ArrowRightIcon } from "./components/Icons.jsx";

import useCollections from "./hooks/useCollections";
import useFilters from "./hooks/useFilters";
import usePokemon from "./hooks/usePokemon";

import styles from "./styles";

const CURRENT_VERSION = 24;

const WEIRD_POKEMON_IMAGE_NAMES = [
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

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Custom hooks
  const { pokemon } = usePokemon(CURRENT_VERSION);
  const {
    filters,
    options,
    toggleFilter,
    toggleXButtons,
    toggleAllShiny,
    toggleAllPokemon
  } = useFilters();
  const {
    collections,
    currentCollection,
    setCurrentCollection,
    removedPokemon,
    addRemovePokemon,
    clearAllSelectedPokemon,
    toggleFullyRemovePokemon,
    clearAllRemovedPokemon,
    addNewCollection,
    deleteCollection,
    updateCollectionName,
    getSharingUrl,
    addSharedCollection
  } = useCollections();

  // UI State
  const [panel, setPanel] = useState("selecting");
  const [searchedPokemon, setSearchedPokemon] = useState("");
  const [showNav, setShowNav] = useState(false);
  const [filtersMenuOpen, setFiltersMenuOpen] = useState(true);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const [featuresMenuOpen, setFeaturesMenuOpen] = useState(false);
  const [contactMenuOpen, setContactMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [focusedCollection, setFocusedCollection] = useState("default");
  const [deleteCollectionModal, setDeleteCollectionModal] = useState(false);
  const [shareCollectionModal, setShareCollectionModal] = useState(false);
  const [sharedCollection, setSharedCollection] = useState(null);

  // Handle shared collection from URL
  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.collection_name) {
      const currentPokemon = {};
      query.pokemon.split(",").forEach((pokemonId) => {
        currentPokemon[pokemonId] = pokemonId;
      });
      setPanel("shared_collection");
      setSharedCollection({
        name: query.collection_name,
        pokemon_ids: currentPokemon
      });
    }
  }, [location.search]);

  // Filter pokemon based on current filters and options
  const shouldRenderPokemon = useCallback((poke) => {
    // Check filters
    const dontRender = Object.keys(filters).some((filter) => {
      if (!filters[filter]) {
        if (filter[4] == poke.gen) {
          return true;
        } else if (poke[filter]) {
          return true;
        }
      }
      return false;
    });

    if (dontRender) return false;

    // Check shiny availability
    if (!options.showAllShiny && poke.shiny) {
      if (!liveShinys.some((pokemonNumber) => pokemonNumber == poke.number)) {
        return false;
      }
    }

    // Check pokemon availability
    if (!options.showAllPokemon) {
      if (nonLivePokemon.some((pokemonNumber) => pokemonNumber == poke.number)) {
        return false;
      }
    }

    // Check search
    if (searchedPokemon !== "") {
      let searchedPokemonNumber;
      if (searchedPokemon.length === 3) {
        searchedPokemonNumber = searchedPokemon;
      } else if (searchedPokemon.length === 2) {
        searchedPokemonNumber = "0" + searchedPokemon;
      } else {
        searchedPokemonNumber = "00" + searchedPokemon;
      }

      if (poke.number !== searchedPokemonNumber) {
        return false;
      }
    }

    // Check weird pokemon
    if (WEIRD_POKEMON_IMAGE_NAMES.some((imageName) => imageName === poke.image)) {
      return false;
    }

    return true;
  }, [filters, options, searchedPokemon]);

  // Handlers
  const handlePokemonClick = useCallback((poke) => {
    addRemovePokemon(poke.id);
  }, [addRemovePokemon]);

  const handleToggleRemove = useCallback((poke) => {
    toggleFullyRemovePokemon(poke.id);
  }, [toggleFullyRemovePokemon]);

  const handleCollectionNameChange = useCallback((e) => {
    updateCollectionName(e.target.value);
  }, [updateCollectionName]);

  const handleSelectCollection = useCallback((key) => {
    setCurrentCollection(key);
    setDropdownOpen(false);
  }, [setCurrentCollection]);

  const openDeleteModal = useCallback((key) => {
    setFocusedCollection(key);
    setDeleteCollectionModal(true);
  }, []);

  const openShareModal = useCallback((key) => {
    setFocusedCollection(key);
    setShareCollectionModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setCopied(false);
    setDeleted(false);
    setShareCollectionModal(false);
    setDeleteCollectionModal(false);
  }, []);

  const handleDeleteCollection = useCallback(() => {
    deleteCollection(focusedCollection);
    setDeleted(true);
    setTimeout(() => {
      setDeleteCollectionModal(false);
      setTimeout(() => setDeleted(false), 1000);
    }, 2000);
  }, [focusedCollection, deleteCollection]);

  const handleAddSharedCollection = useCallback(() => {
    if (sharedCollection) {
      addSharedCollection(sharedCollection);
      navigate("/", { replace: true });
      setPanel("done");
    }
  }, [sharedCollection, addSharedCollection, navigate]);

  const handleViewRemoved = useCallback(() => {
    setShowNav(false);
    setPanel("removed");
  }, []);

  // Render pokemon based on panel
  const renderPokemonList = () => {
    if (panel === "removed") {
      return pokemon
        .filter((poke) => removedPokemon[poke.id])
        .map((poke, key) => (
          <Pokemon
            key={key}
            pokemon={poke}
            selected={collections[currentCollection]?.pokemon_ids[poke.id] || false}
            onClick={() => {}}
            toggleFullyRemovePokemon={handleToggleRemove}
            showFullyRemoveButton={true}
          />
        ));
    }

    if (panel === "shared_collection" && sharedCollection) {
      return pokemon
        .filter((poke) => sharedCollection.pokemon_ids[poke.id])
        .map((poke, key) => (
          <Pokemon
            key={key}
            pokemon={poke}
            selected={false}
            onClick={() => {}}
            selectedScreen={true}
          />
        ));
    }

    if (panel === "done") {
      return pokemon
        .filter((poke) => collections[currentCollection]?.pokemon_ids[poke.id])
        .map((poke, key) => (
          <Pokemon
            key={key}
            pokemon={poke}
            selected={collections[currentCollection]?.pokemon_ids[poke.id]}
            onClick={handlePokemonClick}
            selectedScreen={true}
          />
        ));
    }

    // Default: selecting panel
    return pokemon
      .filter((poke) => shouldRenderPokemon(poke) && !removedPokemon[poke.id])
      .map((poke, key) => (
        <Pokemon
          key={key}
          pokemon={poke}
          selected={collections[currentCollection]?.pokemon_ids[poke.id] || false}
          onClick={handlePokemonClick}
          toggleFullyRemovePokemon={handleToggleRemove}
          showFullyRemoveButton={options.showXButtons}
        />
      ));
  };

  // Render dropdown menu based on panel
  const renderDropdownMenu = () => {
    if (panel === "removed") {
      return <span style={{ color: "red" }}>Removed Pokemon</span>;
    }

    if (panel === "shared_collection" && sharedCollection) {
      return sharedCollection.name;
    }

    return (
      <CollectionDropdown
        collections={collections}
        currentCollection={currentCollection}
        editingName={editingName}
        dropdownOpen={dropdownOpen}
        onToggleEdit={() => setEditingName(!editingName)}
        onToggleDropdown={() => setDropdownOpen(!dropdownOpen)}
        onNameChange={handleCollectionNameChange}
        onSelectCollection={handleSelectCollection}
        onShareCollection={openShareModal}
        onDeleteCollection={openDeleteModal}
        onAddNewCollection={addNewCollection}
      />
    );
  };

  // Render navigation button
  const renderNavigationButton = () => {
    if (panel === "removed" || panel === "done") {
      return (
        <div className="shadow" style={styles.buttonStyle} onClick={() => setPanel("selecting")}>
          Back
        </div>
      );
    }

    if (panel === "shared_collection") {
      return (
        <div className="shadow" style={styles.buttonStyle} onClick={() => setPanel("selecting")}>
          Back
        </div>
      );
    }

    return (
      <div className="shadow" style={styles.buttonStyle} onClick={() => setPanel("done")}>
        View Selected
      </div>
    );
  };

  // Render searchbar
  const renderSearchbar = () => {
    if (panel === "shared_collection") {
      return (
        <div
          className="shadow"
          style={{ ...styles.buttonStyle, marginLeft: 0, width: "100%" }}
          onClick={handleAddSharedCollection}
        >
          Add Collection
        </div>
      );
    }

    if (panel === "selecting") {
      return (
        <input
          placeholder="Search by Pokemon #"
          style={{ ...styles.inputStyle, width: "100%" }}
          name="searchedPokemon"
          id="searchedPokemon"
          type="text"
          value={searchedPokemon}
          onChange={(e) => setSearchedPokemon(e.target.value)}
        />
      );
    }

    return null;
  };

  const closeThingsBackground = dropdownOpen ? (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0)",
        zIndex: 1
      }}
      onClick={() => setDropdownOpen(false)}
    />
  ) : null;

  return (
    <div style={styles.containerStyle}>
      <DeleteCollectionModal
        isOpen={deleteCollectionModal}
        onClose={closeModal}
        onDelete={handleDeleteCollection}
        collectionName={collections[focusedCollection]?.name}
        deleted={deleted}
      />

      <ShareCollectionModal
        isOpen={shareCollectionModal}
        onClose={closeModal}
        url={collections[focusedCollection] ? getSharingUrl(focusedCollection) : ""}
        copied={copied}
        onCopy={() => setCopied(true)}
      />

      {closeThingsBackground}

      <svg
        onClick={() => setShowNav(true)}
        fill="darkcyan"
        xmlns="http://www.w3.org/2000/svg"
        cursor="pointer"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        style={{ position: 'absolute', top: 0, left: 0, padding: 16 }}
      >
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
      </svg>

      <SideNav
        showNav={showNav}
        onHideNav={() => setShowNav(false)}
        title="PoGo Collector"
        items={[
          <div style={styles.menuStyle}>
            <FilterPanel
              filters={filters}
              filtersMenuOpen={filtersMenuOpen}
              onToggleMenu={() => setFiltersMenuOpen(!filtersMenuOpen)}
              onToggleFilter={toggleFilter}
            />

            <MoreMenu
              moreMenuOpen={moreMenuOpen}
              options={options}
              onToggleMenu={() => setMoreMenuOpen(!moreMenuOpen)}
              onToggleXButtons={toggleXButtons}
              onToggleAllPokemon={toggleAllPokemon}
              onToggleAllShiny={toggleAllShiny}
              onViewRemoved={handleViewRemoved}
              onClearRemovedPokemon={clearAllRemovedPokemon}
              onClearSelectedPokemon={clearAllSelectedPokemon}
            />

            <AboutMenu
              aboutMenuOpen={aboutMenuOpen}
              onToggleMenu={() => setAboutMenuOpen(!aboutMenuOpen)}
            />

            <FeaturesMenu
              featuresMenuOpen={featuresMenuOpen}
              onToggleMenu={() => setFeaturesMenuOpen(!featuresMenuOpen)}
            />

            <ContactMenu
              contactMenuOpen={contactMenuOpen}
              featuresMenuOpen={featuresMenuOpen}
              onToggleMenu={() => setContactMenuOpen(!contactMenuOpen)}
            />

            <div style={{ 
              position: 'absolute', 
              bottom: 16, 
              left: 16, 
              fontSize: 12, 
              color: '#888',
              fontStyle: 'italic',
              pointerEvents: 'none',
              userSelect: 'none'
            }}>
              v{import.meta.env.PACKAGE_VERSION || '1.0.1'}
            </div>
          </div>
        ]}
        navStyle={styles.navStyle}
        titleStyle={styles.navTitleStyle}
        itemStyle={styles.navItemStyle}
        itemHoverStyle={styles.navItemHoverStyle}
      />

      <div style={styles.header}>
        <div style={{ fontSize: 21, marginTop: 16 }}>
          PoGo Collector
        </div>

        <div style={styles.dropdownTriggerStyle}>
          {renderDropdownMenu()}
        </div>

        <div style={{ display: "flex", width: "100%", minHeight: 48 }}>
          <label htmlFor="searchedPokemon" style={{ display: "none" }}>
            Search by Pokemon #
          </label>
          {renderSearchbar()}

          <div style={styles.buttonsStyle}>
            {renderNavigationButton()}
          </div>
        </div>
      </div>

      <div style={styles.style}>
        {renderPokemonList()}
      </div>
    </div>
  );
};

export default HomePage;
