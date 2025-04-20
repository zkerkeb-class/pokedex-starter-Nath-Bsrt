import "./home.css";
import axios from "axios";
import PokemonCard from "../components/pokemonCard";
import SearchBar from "../components/searchBar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Importer 'useNavigate'
import { useAuth } from "../context/AuthContext";  // Importer 'useAuth'

function App() {
  const { isAuthenticated, currentUser, logout } = useAuth();  // Récupérer l'état d'authentification et les fonctions
  const navigate = useNavigate();

  // Vérification si l'utilisateur est authentifié, sinon redirection vers la page de connexion
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");  // Redirige vers la page de login si non authentifié
    }
  }, [isAuthenticated, navigate]);

  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonsPerPage] = useState(24);

  // Fonction pour transformer un pokémon personnalisé au format attendu par l'interface
  const transformCustomPokemon = (customPokemon) => {
    // Extraction des stats de base
    const base = {};
    customPokemon.stats.forEach(stat => {
      if (stat.stat.name === 'hp') base.HP = stat.base_stat;
      else if (stat.stat.name === 'attack') base.Attack = stat.base_stat;
      else if (stat.stat.name === 'defense') base.Defense = stat.base_stat;
      else if (stat.stat.name === 'special-attack') base["Sp. Attack"] = stat.base_stat;
      else if (stat.stat.name === 'special-defense') base["Sp. Defense"] = stat.base_stat;
      else if (stat.stat.name === 'speed') base.Speed = stat.base_stat;
    });

    // Transformation des types
    const types = customPokemon.types.map(t => 
      // Première lettre en majuscule pour être cohérent avec le format de l'API
      t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)
    );

    // Créer un nom avec les langues requises
    const pokemonName = customPokemon.name;
    const name = {
      english: pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1),
      french: pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1),
      japanese: pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1),
      chinese: pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
    };

    // Construction du pokemon au format attendu
    return {
      id: customPokemon.id,
      name: name,
      type: types,
      base: base,
      image: customPokemon.sprites.other["official-artwork"].front_default,
      favorite: localStorage.getItem(`favorite-${customPokemon.id}`) === 'true',
      isCustom: true // Marquer comme personnalisé pour d'éventuelles fonctionnalités spécifiques
    };
  };

  useEffect(() => {
    // Chargement des Pokémon de l'API
    axios.get('http://localhost:3000/api/pokemons').then((response) => {
      // Récupération des Pokémon de l'API
      let apiPokemons = response.data.map(pokemon => ({
        ...pokemon,
        favorite: localStorage.getItem(`favorite-${pokemon.id}`) === 'true'
      }));

      // Récupération des Pokémon personnalisés du localStorage
      const customPokemonJSON = localStorage.getItem('customPokemon');
      let allPokemons = [...apiPokemons];
      
      if (customPokemonJSON) {
        try {
          const customPokemons = JSON.parse(customPokemonJSON);
          // Transformation des Pokémon personnalisés au format attendu et ajout à la liste
          const formattedCustomPokemons = customPokemons.map(transformCustomPokemon);
          allPokemons = [...apiPokemons, ...formattedCustomPokemons];
          console.log('Pokémon personnalisés chargés:', formattedCustomPokemons);
        } catch (error) {
          console.error('Erreur lors du chargement des Pokémon personnalisés:', error);
        }
      }

      setPokemons(allPokemons);
    }).catch((error) => {
      alert('Erreur lors de la récupération des pokemons');
      console.log(error);
    });
  }, []);

  // Fonction pour toggle les favoris
  const toggleFavorite = (id) => {
    setPokemons(prevPokemons => {
      const updatedPokemons = prevPokemons.map(pokemon => {
        if (pokemon.id === id) {
          const newFavoriteStatus = !pokemon.favorite;
          // Persister l'état des favoris dans le localStorage
          localStorage.setItem(`favorite-${id}`, newFavoriteStatus.toString());
          return { ...pokemon, favorite: newFavoriteStatus };
        }
        return pokemon;
      });
      return updatedPokemons;
    });
  };

  // Fonction pour basculer l'affichage des favoris
  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
    setCurrentPage(1); // Réinitialiser à la première page lors de la bascule
  };

  // Filtrer les pokémons selon la recherche, les types et les favoris
  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch = pokemon.name.french.toLowerCase().includes(search.toLowerCase());
    const matchesTypes = selectedTypes.length === 0 || selectedTypes.every(type => pokemon.type.includes(type));
    const matchesFavorites = !showFavorites || pokemon.favorite;
    
    return matchesSearch && matchesTypes && matchesFavorites;
  });

  // Obtenir les pokémons de la page courante
  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = filteredPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);

  // Fonction pour changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredPokemons.length / pokemonsPerPage);

  // Générer un tableau de numéros de page pour la navigation
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Navbar 
        showFavorites={showFavorites} 
        toggleFavorites={toggleFavorites} 
        user={currentUser}
        logout={logout}
      />
      <div className="app-container">
        <div className="search-bar-container">
          <SearchBar
            search={search}
            setSearch={setSearch}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
          />
          <div className="wtp-button-container">
            <button
              className="add-pokemon-button"
              onClick={() => navigate('/add-pokemon')}
            >
              Ajouter un Pokémon
            </button>
          </div>
        </div>

        <div className="pokemon-list-container">
          {currentPokemons.length > 0 ? (
            currentPokemons.map((pokemon) => (
              <div key={pokemon.id} className="pokemon-card-container">
                <PokemonCard
                  pokemon={pokemon}
                  setPokemons={setPokemons}
                  name={pokemon.name.french}
                  image={pokemon.image}
                  types={pokemon.type}
                  hp={pokemon.base.HP}
                  attack={pokemon.base.Attack}
                  defense={pokemon.base.Defense}
                  id={pokemon.id}
                  favorite={pokemon.favorite}
                  toggleFavorite={toggleFavorite}
                  isCustom={pokemon.isCustom}
                />
              </div>
            ))
          ) : (
            <div className="no-results">Aucun Pokémon ne correspond à votre recherche</div>
          )}
        </div>

        {/* Pagination */}
        {filteredPokemons.length > 0 && (
          <div className="pagination">
            <button 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              &laquo; Précédent
            </button>
            
            <div className="page-numbers">
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`page-number ${currentPage === number ? 'active' : ''}`}
                >
                  {number}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Suivant &raquo;
            </button>
            
            <div className="pagination-info">
              Page {currentPage} sur {totalPages} 
              ({filteredPokemons.length} Pokémon{filteredPokemons.length > 1 ? 's' : ''})
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
