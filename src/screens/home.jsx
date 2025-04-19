import "./home.css";
import axios from "axios";
import PokemonCard from "../components/pokemonCard";
import SearchBar from "../components/searchBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Importer 'useNavigate'
import { useAuth } from "../context/AuthContext";  // Importer 'useAuth'

function App() {
  const { isAuthenticated } = useAuth();  // Récupérer l'état d'authentification
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
  const [pokemonsPerPage] = useState(12);

  useEffect(() => {
    axios.get('http://localhost:3000/api/pokemons').then((response) => {
      console.log('axios', response.data.pokemons);
      console.log("Réponse de l'API:", response.data);  // Affiche la réponse de l'API
      console.log("Pokemons:", response.data.pokemons);  // Affiche les pokémons

      // Ajout de la propriété favorite à chaque pokémon
      const pokemonsWithFavorites = response.data.map(pokemon => ({
        ...pokemon,
        favorite: localStorage.getItem(`favorite-${pokemon.id}`) === 'true'
      }));
      setPokemons(pokemonsWithFavorites);
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
    <div className="app-container">
      <div className="search-bar-container">
        <SearchBar
          search={search}
          setSearch={setSearch}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
        />
        <div className="favorites-filter">
          <label className="favorites-label">
            <input
              type="checkbox"
              checked={showFavorites}
              onChange={() => setShowFavorites(!showFavorites)}
            />
            Afficher uniquement les favoris
          </label>
        </div>
        <div className="wtp-button-container">
          <button
            className="wtp-button"
            onClick={() => navigate('/wtp')}
          >
            Qui est ce Pokémon?
          </button>
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
  );
}

export default App;
