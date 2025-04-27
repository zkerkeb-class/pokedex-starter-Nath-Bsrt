import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddPokemon.css';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const AddPokemon = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [types, setTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    height: '',
    weight: '',
    types: [],
    hp: '',
    attack: '',
    defense: '',
    specialAttack: '',
    specialDefense: '',
    speed: '',
    image: '',
    shinyImage: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Dummy state pour la navbar
  const [showFavorites, setShowFavorites] = useState(false);

  // Fonction dummy pour la navbar
  const toggleFavorites = () => {
    navigate('/');
  };

  useEffect(() => {
    // Charger les types disponibles
    fetch('https://pokeapi.co/api/v2/type')
      .then(response => response.json())
      .then(data => {
        // Filtrer les types "unknown", "shadow" et "stellar"
        const filteredTypes = data.results.filter(
          type => type.name !== 'unknown' && type.name !== 'shadow' && type.name !== 'stellar'
        );
        setTypes(filteredTypes);
      })
      .catch(error => console.error('Erreur lors du chargement des types:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          types: [...prev.types, value]
        };
      } else {
        return {
          ...prev,
          types: prev.types.filter(type => type !== value)
        };
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.height) newErrors.height = "La taille est requise";
    if (!formData.weight) newErrors.weight = "Le poids est requis";
    if (formData.types.length === 0) newErrors.types = "Au moins un type est requis";
    if (!formData.hp) newErrors.hp = "Les PV sont requis";
    if (!formData.attack) newErrors.attack = "L'attaque est requise";
    if (!formData.defense) newErrors.defense = "La défense est requise";
    if (!formData.specialAttack) newErrors.specialAttack = "L'attaque spéciale est requise";
    if (!formData.specialDefense) newErrors.specialDefense = "La défense spéciale est requise";
    if (!formData.speed) newErrors.speed = "La vitesse est requise";
    if (!formData.image) newErrors.image = "L'URL de l'image est requise";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Obtenir les Pokémon existants pour trouver le prochain ID disponible
      const existingPokemon = JSON.parse(localStorage.getItem('customPokemon')) || [];
      
      // Trouver l'ID maximum parmi les Pokémon existants et ajouter 10000
      // pour éviter les conflits avec les Pokémon de l'API
      let maxId = 10000; // ID de base pour les Pokémon personnalisés
      
      if (existingPokemon.length > 0) {
        const maxExistingId = Math.max(...existingPokemon.map(p => p.id));
        maxId = Math.max(maxId, maxExistingId + 1);
      }
      
      // Créer l'objet Pokémon au format compatible avec l'API
      const newPokemon = {
        id: maxId,
        name: formData.name.toLowerCase(),
        height: parseInt(formData.height, 10),
        weight: parseInt(formData.weight, 10),
        types: formData.types.map(type => ({
          type: { name: type }
        })),
        stats: [
          { base_stat: parseInt(formData.hp, 10), stat: { name: 'hp' } },
          { base_stat: parseInt(formData.attack, 10), stat: { name: 'attack' } },
          { base_stat: parseInt(formData.defense, 10), stat: { name: 'defense' } },
          { base_stat: parseInt(formData.specialAttack, 10), stat: { name: 'special-attack' } },
          { base_stat: parseInt(formData.specialDefense, 10), stat: { name: 'special-defense' } },
          { base_stat: parseInt(formData.speed, 10), stat: { name: 'speed' } }
        ],
        sprites: {
          other: {
            'official-artwork': {
              front_default: formData.image,
              front_shiny: formData.shinyImage || formData.image
            }
          }
        }
      };
      
      console.log('Nouveau Pokémon créé:', newPokemon);
      
      // Stockage dans localStorage
      localStorage.setItem('customPokemon', JSON.stringify([...existingPokemon, newPokemon]));
      
      // Afficher un message de succès et revenir à la page d'accueil
      alert('Pokémon ajouté avec succès!');
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la création du Pokémon:', error);
      setErrors({ submit: 'Une erreur est survenue lors de la création du Pokémon.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour obtenir l'ID du type à partir de son nom
  const getTypeId = (typeName) => {
    const typeMap = {
      'normal': 1, 'fighting': 2, 'flying': 3, 'poison': 4, 'ground': 5,
      'rock': 6, 'bug': 7, 'ghost': 8, 'steel': 9, 'fire': 10,
      'water': 11, 'grass': 12, 'electric': 13, 'psychic': 14, 'ice': 15,
      'dragon': 16, 'dark': 17, 'fairy': 18
    };
    return typeMap[typeName] || 1; // Retourne 1 (normal) par défaut si non trouvé
  };

  // Import dynamique des images de types
  const getTypeImageUrl = (typeName) => {
    try {
      // Utiliser require pour importer dynamiquement l'image
      const typeId = getTypeId(typeName);
      return new URL(`../../assets/types/${typeId}.png`, import.meta.url).href;
    } catch (error) {
      console.error(`Erreur lors du chargement de l'image pour le type ${typeName}:`, error);
      return ''; // Retourner une chaîne vide en cas d'échec
    }
  };

  return (
    <>
      <Navbar 
        showFavorites={showFavorites}
        toggleFavorites={toggleFavorites}
        user={currentUser}
        logout={logout}
      />
      <div className="add-pokemon-container">
        <h1 className="add-pokemon-title">Ajouter un nouveau Pokémon</h1>
        
        <form className="pokemon-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Informations générales</h2>
            
            <div className="form-group">
              <label htmlFor="name">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="height">Taille (dm)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  min="1"
                  value={formData.height}
                  onChange={handleChange}
                  className={errors.height ? 'error' : ''}
                />
                {errors.height && <span className="error-message">{errors.height}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="weight">Poids (hg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  min="1"
                  value={formData.weight}
                  onChange={handleChange}
                  className={errors.weight ? 'error' : ''}
                />
                {errors.weight && <span className="error-message">{errors.weight}</span>}
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Types</h2>
            <div className="types-grid">
              {types.map(type => (
                <div key={type.name} className="type-checkbox">
                  <input
                    type="checkbox"
                    id={`type-${type.name}`}
                    value={type.name}
                    checked={formData.types.includes(type.name)}
                    onChange={handleTypeChange}
                  />
                  <label htmlFor={`type-${type.name}`}>
                    <img 
                      src={getTypeImageUrl(type.name)} 
                      alt={type.name} 
                      className="type-icon"
                      title={type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                    />
                  </label>
                </div>
              ))}
            </div>
            {errors.types && <span className="error-message">{errors.types}</span>}
          </div>
          
          <div className="form-section">
            <h2>Statistiques</h2>
            
            <div className="stats-grid">
              <div className="form-group">
                <label htmlFor="hp">PV</label>
                <input
                  type="number"
                  id="hp"
                  name="hp"
                  min="1"
                  max="255"
                  value={formData.hp}
                  onChange={handleChange}
                  className={errors.hp ? 'error' : ''}
                />
                {errors.hp && <span className="error-message">{errors.hp}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="attack">Attaque</label>
                <input
                  type="number"
                  id="attack"
                  name="attack"
                  min="1"
                  max="255"
                  value={formData.attack}
                  onChange={handleChange}
                  className={errors.attack ? 'error' : ''}
                />
                {errors.attack && <span className="error-message">{errors.attack}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="defense">Défense</label>
                <input
                  type="number"
                  id="defense"
                  name="defense"
                  min="1"
                  max="255"
                  value={formData.defense}
                  onChange={handleChange}
                  className={errors.defense ? 'error' : ''}
                />
                {errors.defense && <span className="error-message">{errors.defense}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="specialAttack">Attaque Spé.</label>
                <input
                  type="number"
                  id="specialAttack"
                  name="specialAttack"
                  min="1"
                  max="255"
                  value={formData.specialAttack}
                  onChange={handleChange}
                  className={errors.specialAttack ? 'error' : ''}
                />
                {errors.specialAttack && <span className="error-message">{errors.specialAttack}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="specialDefense">Défense Spé.</label>
                <input
                  type="number"
                  id="specialDefense"
                  name="specialDefense"
                  min="1"
                  max="255"
                  value={formData.specialDefense}
                  onChange={handleChange}
                  className={errors.specialDefense ? 'error' : ''}
                />
                {errors.specialDefense && <span className="error-message">{errors.specialDefense}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="speed">Vitesse</label>
                <input
                  type="number"
                  id="speed"
                  name="speed"
                  min="1"
                  max="255"
                  value={formData.speed}
                  onChange={handleChange}
                  className={errors.speed ? 'error' : ''}
                />
                {errors.speed && <span className="error-message">{errors.speed}</span>}
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Images</h2>
            
            <div className="form-group">
              <label htmlFor="image">URL de l'image normale</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={errors.image ? 'error' : ''}
              />
              {errors.image && <span className="error-message">{errors.image}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="shinyImage">URL de l'image Shiny (optionnel)</label>
              <input
                type="text"
                id="shinyImage"
                name="shinyImage"
                value={formData.shinyImage}
                onChange={handleChange}
              />
            </div>

            {formData.image && (
              <div className="image-preview">
                <div>
                  <p>Version normale</p>
                  <img src={formData.image} alt="Aperçu" />
                </div>
                {formData.shinyImage && (
                  <div>
                    <p>Version Shiny</p>
                    <img src={formData.shinyImage} alt="Aperçu Shiny" />
                  </div>
                )}
              </div>
            )}
          </div>
          
          {errors.submit && <div className="error-message global-error">{errors.submit}</div>}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate('/')}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Création en cours...' : 'Créer Pokémon'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddPokemon; 