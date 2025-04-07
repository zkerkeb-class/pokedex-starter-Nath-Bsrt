import { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import { useNavigate } from "react-router";

const PokemonCard = ({ name, image, types, hp, attack, defense, id, setPokemons, pokemon }) => {
  const [currentHp, setCurrentHp] = useState(hp);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const navigate = useNavigate();

  // Rediriger vers la page de détails du Pokémon lorsqu'on clique sur la carte
  const goToPokemon = (id) => {
    navigate(`/pokemon/${id}`);
  };

  // Supprimer un Pokémon
  const deletePokemon = (id) => {
    console.log("Suppression du Pokémon");
    axios.delete(`http://localhost:3000/api/pokemons/${id}`).then((response) => {
      console.log("Pokémon supprimé", response.data);
      setPokemons(response.data.newPokemonsList);
    }).catch((error) => {
      console.log("Erreur lors de la suppression du Pokémon", error);
    });
  };

  // Modifier un Pokémon
  const editPokemon = (id) => {
    const newPokemon = {
      ...pokemon,
      name: {
        ...pokemon.name,
        french: editedName,
      },
    };

    axios.put(`http://localhost:3000/api/pokemons/${id}`, newPokemon).then((response) => {
      console.log("Pokémon modifié", response.data);
      setIsEditing(false);
      // setPokemons(response.data.newPokemonsList);
    }).catch((error) => {
      alert("Erreur lors de la modification du Pokémon");
      console.log("Erreur lors de la modification du Pokémon", error);
    });
  };

  useEffect(() => {
    if (currentHp <= 0) {
      alert("Le Pokémon est mort");
    }
  }, [currentHp]);

  return (
    <div className="pokemon-card" onClick={() => goToPokemon(id)}> {/* Cliquez sur la carte pour voir le Pokémon */}
      <div className="pokemon-name-container">
        {isEditing ? (
          <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
        ) : (
          <span className="pokemon-name">{editedName}</span>
        )}
      </div>
      <img className="pokemon-image" src={image} alt={name} />

      <div className="pokemon-types-container">
        {types.map((type) => {
          return <span key={type}>{type}</span>;
        })}
      </div>

      <div className="pokemon-stats-container">
        <span>HP: {currentHp}</span>
        <span>Attack: {attack}</span>
        <span>Defense: {defense}</span>
      </div>

      {/* Boutons */}
      <button className="delete-button" onClick={(e) => { e.stopPropagation(); deletePokemon(id); }}>
        Supprimer
      </button>
      <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? "Annuler" : "Modifier"}
      </button>
      {isEditing ? <button className="save-button" onClick={() => editPokemon(id)}>Enregistrer</button> : null}
    </div>
  );
};

export default PokemonCard;
