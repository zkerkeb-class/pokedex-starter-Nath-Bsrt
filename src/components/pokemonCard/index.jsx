import { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import { useNavigate } from "react-router";
import { typeImages } from "../../assets/typeImages"; // Import des images de types

const PokemonCard = ({ name, image, types, hp, attack, defense, id, setPokemons, pokemon, favorite, toggleFavorite }) => {
  const [currentHp, setCurrentHp] = useState(hp);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  
  // Fonction pour formater l'ID avec des zéros au début (001, 002, etc.)
  const formatId = (id) => {
    return String(id).padStart(3, '0');
  };

  const navigate = useNavigate();

  // Rediriger vers la page de détails du Pokémon lorsqu'on clique sur la carte
  const goToPokemon = (id) => {
    // Ne pas naviguer si on est en mode édition
    if (!isEditing) {
      navigate(`/pokemon/${id}`);
    }
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

  // Fonction pour gérer le clic sur l'étoile des favoris
  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Empêcher la navigation vers la page de détail
    toggleFavorite(id);
  };

  // Fonction pour gérer le clic sur le bouton modifier
  const handleEditClick = (e) => {
    e.stopPropagation(); // Empêcher la navigation vers la page de détail
    setIsEditing(!isEditing);
  };

  // Fonction pour gérer l'input du nom
  const handleNameInputClick = (e) => {
    e.stopPropagation(); // Empêcher la navigation vers la page de détail
  };

  return (
    <div className="pokemon-card" onClick={() => goToPokemon(id)} data-id={formatId(id)}>
      <div className="card-header">
        <div className="pokemon-name-container">
          {isEditing ? (
            <div className="pokemon-name-edit-wrapper">
              <input 
                type="text" 
                value={editedName} 
                onChange={(e) => setEditedName(e.target.value)} 
                onClick={handleNameInputClick} 
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          ) : (
            <div className="pokemon-name-wrapper">
              <span className="pokemon-name">{editedName}</span>
            </div>
          )}
        </div>
        <button 
          className={`favorite-button ${favorite ? 'is-favorite' : ''}`}
          onClick={handleFavoriteClick}
          title={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          ★
        </button>
      </div>
      
      <img className="pokemon-image" src={image} alt={name} />

      <div className="pokemon-types-container">
        {types.map((type) => (
          <div key={type} className="type-container" data-type={type}>
            <img 
              src={typeImages[type]} 
              alt={type} 
              className="type-image" 
              title={type}
            />
            {/* Le nom du type est masqué en CSS */}
            <span className="type-name">{type}</span>
          </div>
        ))}
      </div>

      {/* Les stats ont été supprimées */}

      {/* Boutons d'action */}
      <div className="card-actions">
        <button className="edit-button" onClick={handleEditClick}>
          {isEditing ? "Annuler" : "Modifier"}
        </button>
        <button className="delete-button" onClick={(e) => { e.stopPropagation(); deletePokemon(id); }}>
          Supprimer
        </button>
        {isEditing && 
          <button className="save-button" onClick={(e) => { e.stopPropagation(); editPokemon(id); }}>
            Enregistrer
          </button>
        }
      </div>
    </div>
  );
};

export default PokemonCard;
