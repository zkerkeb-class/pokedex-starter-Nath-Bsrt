import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddPokemon.css';
import Navbar from '../components/Navbar';

const AddPokemon = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    // Charger les types disponibles
    fetch('https://pokeapi.co/api/v2/type')
      .then(response => response.json())
      .then(data => {
        // Filtrer les types "unknown" et "shadow"
        const filteredTypes = data.results.filter(
          type => type.name !== 'unknown' && type.name !== 'shadow'
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
      // Trouver le prochain ID disponible
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1&offset=1000');
      const data = await response.json();
      const newId = data.count + 1;
      
      // Créer l'objet Pokémon
      const newPokemon = {
        id: newId,
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
      
      // Dans un environnement réel, vous enverriez cela à votre API
      console.log('Nouveau Pokémon créé:', newPokemon);
      
      // Stockage dans localStorage pour la démonstration
      const existingPokemon = JSON.parse(localStorage.getItem('customPokemon')) || [];
      localStorage.setItem('customPokemon', JSON.stringify([...existingPokemon, newPokemon]));
      
      alert('Pokémon ajouté avec succès!');
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la création du Pokémon:', error);
      setErrors({ submit: 'Une erreur est survenue lors de la création du Pokémon.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
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
                      src={`/types/${type.name}.svg`} 
                      alt={type.name} 
                      className="type-icon"
                    />
                    <span>{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</span>
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
    </div>
  );
};

export default AddPokemon; 