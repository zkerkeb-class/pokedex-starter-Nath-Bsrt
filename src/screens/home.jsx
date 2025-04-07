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

  useEffect(() => {
    axios.get('http://localhost:3000/api/pokemons').then((response) => {
      console.log('axios', response.data.pokemons);
      console.log("Réponse de l'API:", response.data);  // Affiche la réponse de l'API
      console.log("Pokemons:", response.data.pokemons);  // Affiche les pokémons

      setPokemons(response.data);
    }).catch((error) => {
      alert('Erreur lors de la récupération des pokemons');
      console.log(error);
    });
  }, []);

  useEffect(() => {
    console.log(search);
    console.log(selectedTypes);
  }, [search, selectedTypes]);

  return (
    <div className="app-container">
      <div className="search-bar-container">
        <SearchBar
          search={search}
          setSearch={setSearch}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
        />
      </div>

      <div className="pokemon-list-container">
  {Array.isArray(pokemons) && pokemons.length > 0 ? (
    pokemons.map((pokemon) => {
      if (
        !pokemon.name.french.toLowerCase().includes(search.toLowerCase()) ||
        !selectedTypes.every((type) => pokemon.type.includes(type))
      ) {
        return null;
      }
      return (
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
          />
        </div>
      );
    })
  ) : (
    <div>Chargement...</div> 
  )}
</div>
    </div>
  );
}

export default App;
