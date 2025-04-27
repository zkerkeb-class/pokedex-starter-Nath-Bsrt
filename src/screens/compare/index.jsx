import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { typeImages } from '../../assets/typeImages';
import { pokemonImages } from '../../assets/imageLibrary';

const PokemonCompare = () => {
  const [allPokemon, setAllPokemon] = useState([]);
  const [selectedPokemon1, setSelectedPokemon1] = useState('');
  const [selectedPokemon2, setSelectedPokemon2] = useState('');
  const [pokemon1Data, setPokemon1Data] = useState(null);
  const [pokemon2Data, setPokemon2Data] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  // Récupération de tous les Pokémon lors du montage du composant
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/pokemons');
        setAllPokemon(response.data);
      } catch (err) {
        setError('Impossible de charger les Pokémon. Veuillez réessayer plus tard.');
        console.error(err);
      }
    };

    fetchPokemon();
  }, []);

  // Données d'efficacité des types
  const typeEffectiveness = {
    normal: { weaknesses: ['fighting'], resistances: [], immunities: ['ghost'] },
    fire: { weaknesses: ['water', 'ground', 'rock'], resistances: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], immunities: [] },
    water: { weaknesses: ['electric', 'grass'], resistances: ['fire', 'water', 'ice', 'steel'], immunities: [] },
    electric: { weaknesses: ['ground'], resistances: ['electric', 'flying', 'steel'], immunities: [] },
    grass: { weaknesses: ['fire', 'ice', 'poison', 'flying', 'bug'], resistances: ['water', 'electric', 'grass', 'ground'], immunities: [] },
    ice: { weaknesses: ['fire', 'fighting', 'rock', 'steel'], resistances: ['ice'], immunities: [] },
    fighting: { weaknesses: ['flying', 'psychic', 'fairy'], resistances: ['bug', 'rock', 'dark'], immunities: [] },
    poison: { weaknesses: ['ground', 'psychic'], resistances: ['grass', 'fighting', 'poison', 'bug', 'fairy'], immunities: [] },
    ground: { weaknesses: ['water', 'grass', 'ice'], resistances: ['poison', 'rock'], immunities: ['electric'] },
    flying: { weaknesses: ['electric', 'ice', 'rock'], resistances: ['grass', 'fighting', 'bug'], immunities: ['ground'] },
    psychic: { weaknesses: ['bug', 'ghost', 'dark'], resistances: ['fighting', 'psychic'], immunities: [] },
    bug: { weaknesses: ['fire', 'flying', 'rock'], resistances: ['grass', 'fighting', 'ground'], immunities: [] },
    rock: { weaknesses: ['water', 'grass', 'fighting', 'ground', 'steel'], resistances: ['normal', 'fire', 'poison', 'flying'], immunities: [] },
    ghost: { weaknesses: ['ghost', 'dark'], resistances: ['poison', 'bug'], immunities: ['normal', 'fighting'] },
    dragon: { weaknesses: ['ice', 'dragon', 'fairy'], resistances: ['fire', 'water', 'electric', 'grass'], immunities: [] },
    dark: { weaknesses: ['fighting', 'bug', 'fairy'], resistances: ['ghost', 'dark'], immunities: ['psychic'] },
    steel: { weaknesses: ['fire', 'fighting', 'ground'], resistances: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], immunities: ['poison'] },
    fairy: { weaknesses: ['poison', 'steel'], resistances: ['fighting', 'bug', 'dark'], immunities: ['dragon'] },
  };

  // Récupération des données des Pokémon lorsque les sélections changent
  useEffect(() => {
    const fetchPokemonData = async () => {
      if (selectedPokemon1) {
        try {
          const response = await axios.get(`http://localhost:3000/api/pokemons/${selectedPokemon1}`);
          setPokemon1Data(response.data);
        } catch (err) {
          console.error('Error fetching Pokemon 1:', err);
        }
      } else {
        setPokemon1Data(null);
      }
    };
    fetchPokemonData();
  }, [selectedPokemon1]);

  useEffect(() => {
    const fetchPokemonData = async () => {
      if (selectedPokemon2) {
        try {
          const response = await axios.get(`http://localhost:3000/api/pokemons/${selectedPokemon2}`);
          setPokemon2Data(response.data);
        } catch (err) {
          console.error('Error fetching Pokemon 2:', err);
        }
      } else {
        setPokemon2Data(null);
      }
    };
    fetchPokemonData();
  }, [selectedPokemon2]);

  // Gestion de la comparaison
  const handleCompare = () => {
    if (!selectedPokemon1 || !selectedPokemon2 || !pokemon1Data || !pokemon2Data) {
      setError('Veuillez sélectionner deux Pokémon à comparer.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Comparaison des statistiques
      const statsComparison = {
        hp: { 
          pokemon1: pokemon1Data.stats.hp, 
          pokemon2: pokemon2Data.stats.hp, 
          winner: pokemon1Data.stats.hp > pokemon2Data.stats.hp ? pokemon1Data.name.french : 
                  pokemon1Data.stats.hp < pokemon2Data.stats.hp ? pokemon2Data.name.french : 'Égalité' 
        },
        attack: { 
          pokemon1: pokemon1Data.stats.attack, 
          pokemon2: pokemon2Data.stats.attack, 
          winner: pokemon1Data.stats.attack > pokemon2Data.stats.attack ? pokemon1Data.name.french : 
                  pokemon1Data.stats.attack < pokemon2Data.stats.attack ? pokemon2Data.name.french : 'Égalité' 
        },
        defense: { 
          pokemon1: pokemon1Data.stats.defense, 
          pokemon2: pokemon2Data.stats.defense, 
          winner: pokemon1Data.stats.defense > pokemon2Data.stats.defense ? pokemon1Data.name.french : 
                  pokemon1Data.stats.defense < pokemon2Data.stats.defense ? pokemon2Data.name.french : 'Égalité' 
        },
        specialAttack: { 
          pokemon1: pokemon1Data.stats.specialAttack, 
          pokemon2: pokemon2Data.stats.specialAttack, 
          winner: pokemon1Data.stats.specialAttack > pokemon2Data.stats.specialAttack ? pokemon1Data.name.french : 
                  pokemon1Data.stats.specialAttack < pokemon2Data.stats.specialAttack ? pokemon2Data.name.french : 'Égalité' 
        },
        specialDefense: { 
          pokemon1: pokemon1Data.stats.specialDefense, 
          pokemon2: pokemon2Data.stats.specialDefense, 
          winner: pokemon1Data.stats.specialDefense > pokemon2Data.stats.specialDefense ? pokemon1Data.name.french : 
                  pokemon1Data.stats.specialDefense < pokemon2Data.stats.specialDefense ? pokemon2Data.name.french : 'Égalité' 
        },
        speed: { 
          pokemon1: pokemon1Data.stats.speed, 
          pokemon2: pokemon2Data.stats.speed, 
          winner: pokemon1Data.stats.speed > pokemon2Data.stats.speed ? pokemon1Data.name.french : 
                  pokemon1Data.stats.speed < pokemon2Data.stats.speed ? pokemon2Data.name.french : 'Égalité' 
        }
      };

      // Calcul des statistiques totales
      const total1 = Object.values(pokemon1Data.stats).reduce((sum, stat) => sum + stat, 0);
      const total2 = Object.values(pokemon2Data.stats).reduce((sum, stat) => sum + stat, 0);
      
      statsComparison.total = {
        pokemon1: total1,
        pokemon2: total2,
        winner: total1 > total2 ? pokemon1Data.name.french : 
                total1 < total2 ? pokemon2Data.name.french : 'Égalité'
      };

      // Analyse des avantages de types
      const typeAdvantage = analyzeTypeAdvantages(
        pokemon1Data.types,
        pokemon2Data.types,
        pokemon1Data.name.french,
        pokemon2Data.name.french
      );

      // Définition du résultat de la comparaison
      setComparisonResult({
        pokemon1: pokemon1Data,
        pokemon2: pokemon2Data,
        statsComparison,
        typeAdvantage,
        overallWinner: determineOverallWinner(statsComparison, typeAdvantage, pokemon1Data.name.french, pokemon2Data.name.french)
      });

    } catch (err) {
      setError('Impossible de comparer les Pokémon. Veuillez réessayer.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Analyse des avantages de types entre deux Pokémon
  const analyzeTypeAdvantages = (types1, types2, name1, name2) => {
    const advantage = {
      pokemon1: { effective: [], ineffective: [], immune: [] },
      pokemon2: { effective: [], ineffective: [], immune: [] }
    };

    // Conversion des types en minuscules pour la comparaison
    const pokemon1Types = types1.map(t => t.toLowerCase());
    const pokemon2Types = types2.map(t => t.toLowerCase());

    // Vérification des avantages offensifs du Pokémon 1 contre le Pokémon 2
    pokemon1Types.forEach(attackType => {
      pokemon2Types.forEach(defenseType => {
        const effectiveness = typeEffectiveness[defenseType];
        if (effectiveness) {
          if (effectiveness.weaknesses.includes(attackType)) {
            advantage.pokemon1.effective.push(`${name1} (${attackType}) est super efficace contre ${name2} (${defenseType})`);
          } else if (effectiveness.resistances.includes(attackType)) {
            advantage.pokemon1.ineffective.push(`${name1} (${attackType}) n'est pas très efficace contre ${name2} (${defenseType})`);
          } else if (effectiveness.immunities.includes(attackType)) {
            advantage.pokemon1.immune.push(`${name2} (${defenseType}) est immunisé contre ${name1} (${attackType})`);
          }
        }
      });
    });

    // Vérification des avantages offensifs du Pokémon 2 contre le Pokémon 1
    pokemon2Types.forEach(attackType => {
      pokemon1Types.forEach(defenseType => {
        const effectiveness = typeEffectiveness[defenseType];
        if (effectiveness) {
          if (effectiveness.weaknesses.includes(attackType)) {
            advantage.pokemon2.effective.push(`${name2} (${attackType}) est super efficace contre ${name1} (${defenseType})`);
          } else if (effectiveness.resistances.includes(attackType)) {
            advantage.pokemon2.ineffective.push(`${name2} (${attackType}) n'est pas très efficace contre ${name1} (${defenseType})`);
          } else if (effectiveness.immunities.includes(attackType)) {
            advantage.pokemon2.immune.push(`${name1} (${defenseType}) est immunisé contre ${name2} (${attackType})`);
          }
        }
      });
    });

    return advantage;
  };

  // Détermination du vainqueur global basé sur les statistiques et les avantages de types
  const determineOverallWinner = (statsComparison, typeAdvantage, name1, name2) => {
    // Comptage des victoires statistiques
    let stat1Wins = 0;
    let stat2Wins = 0;

    Object.values(statsComparison).forEach(comparison => {
      if (comparison.winner === name1) stat1Wins++;
      else if (comparison.winner === name2) stat2Wins++;
    });

    // Comptage des avantages de types
    const type1Advantage = typeAdvantage.pokemon1.effective.length - typeAdvantage.pokemon1.ineffective.length - typeAdvantage.pokemon1.immune.length;
    const type2Advantage = typeAdvantage.pokemon2.effective.length - typeAdvantage.pokemon2.ineffective.length - typeAdvantage.pokemon2.immune.length;

    // Détermination du vainqueur global
    if (stat1Wins > stat2Wins && type1Advantage >= type2Advantage) {
      return { winner: name1, reason: `${name1} a de meilleures statistiques et des avantages de type.` };
    } else if (stat2Wins > stat1Wins && type2Advantage >= type1Advantage) {
      return { winner: name2, reason: `${name2} a de meilleures statistiques et des avantages de type.` };
    } else if (stat1Wins > stat2Wins) {
      return { winner: name1, reason: `${name1} a de meilleures statistiques globales.` };
    } else if (stat2Wins > stat1Wins) {
      return { winner: name2, reason: `${name2} a de meilleures statistiques globales.` };
    } else if (type1Advantage > type2Advantage) {
      return { winner: name1, reason: `${name1} a plus d'avantages de type.` };
    } else if (type2Advantage > type1Advantage) {
      return { winner: name2, reason: `${name2} a plus d'avantages de type.` };
    } else {
      return { winner: 'Égalité', reason: 'Les deux Pokémon sont égaux en statistiques et avantages de type.' };
    }
  };

  return (
    <div className="pokemon-compare-page">
      <Navbar 
        showFavorites={showFavorites} 
        toggleFavorites={toggleFavorites} 
        user={currentUser}
        logout={logout}
        isComparePage={location.pathname === '/compare'}
      />
      <div className="pokemon-compare-container">
        <h1>Comparateur de Pokémon</h1>
        <p>Sélectionnez deux Pokémon à comparer entre eux</p>

        <div className="pokemon-selectors">
          <div className="pokemon-selector">
            <label htmlFor="pokemon1">Premier Pokémon:</label>
            <select
              id="pokemon1"
              value={selectedPokemon1}
              onChange={(e) => setSelectedPokemon1(e.target.value)}
            >
              <option value="">Sélectionner un Pokémon</option>
              {allPokemon
                .sort((a, b) => a.id - b.id)
                .map((pokemon) => (
                  <option key={`p1-${pokemon.id}`} value={pokemon.id}>
                    #{pokemon.id} - {pokemon.name.french}
                  </option>
                ))}
            </select>
          </div>

          <div className="pokemon-selector">
            <label htmlFor="pokemon2">Second Pokémon:</label>
            <select
              id="pokemon2"
              value={selectedPokemon2}
              onChange={(e) => setSelectedPokemon2(e.target.value)}
            >
              <option value="">Sélectionner un Pokémon</option>
              {allPokemon
                .sort((a, b) => a.id - b.id)
                .map((pokemon) => (
                  <option key={`p2-${pokemon.id}`} value={pokemon.id}>
                    #{pokemon.id} - {pokemon.name.french}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <button 
          className="compare-button" 
          onClick={handleCompare} 
          disabled={isLoading || !selectedPokemon1 || !selectedPokemon2}
        >
          {isLoading ? 'Chargement...' : 'Comparer'}
        </button>

        {error && <div className="error-message">{error}</div>}

        {comparisonResult && (
          <div className="comparison-results">
            <h2>Résultats de la comparaison</h2>
            
            <div className="pokemon-cards">
              <div className="pokemon-card">
                <h3>{comparisonResult.pokemon1.name.french}</h3>
                <div className="pokemon-image">
                  <img 
                    src={pokemonImages[comparisonResult.pokemon1.id]} 
                    alt={comparisonResult.pokemon1.name.french} 
                  />
                </div>
                <div className="pokemon-types">
                  {comparisonResult.pokemon1.types.map((type, index) => (
                    <div key={`p1-type-${index}`} className="type-with-icon">
                      <img 
                        src={typeImages[type]} 
                        alt={type} 
                        className="type-icon" 
                      />
                      <span className={`type type-${type.toLowerCase()}`}>
                        {type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="versus">VS</div>
              
              <div className="pokemon-card">
                <h3>{comparisonResult.pokemon2.name.french}</h3>
                <div className="pokemon-image">
                  <img 
                    src={pokemonImages[comparisonResult.pokemon2.id]} 
                    alt={comparisonResult.pokemon2.name.french} 
                  />
                </div>
                <div className="pokemon-types">
                  {comparisonResult.pokemon2.types.map((type, index) => (
                    <div key={`p2-type-${index}`} className="type-with-icon">
                      <img 
                        src={typeImages[type]} 
                        alt={type} 
                        className="type-icon"
                      />
                      <span className={`type type-${type.toLowerCase()}`}>
                        {type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="winner-announcement">
              <h2>
                {comparisonResult.overallWinner.winner === 'Égalité' 
                  ? 'Match nul !' 
                  : `Vainqueur : ${comparisonResult.overallWinner.winner}`}
              </h2>
              <p>{comparisonResult.overallWinner.reason}</p>
            </div>
            
            <div className="comparison-stats">
              <h3>Statistiques</h3>
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Statistique</th>
                    <th>{comparisonResult.pokemon1.name.french}</th>
                    <th>{comparisonResult.pokemon2.name.french}</th>
                    <th>Vainqueur</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(comparisonResult.statsComparison).map(([stat, values]) => (
                    <tr key={stat}>
                      <td>{stat === 'hp' ? 'HP' : 
                           stat === 'attack' ? 'Attaque' : 
                           stat === 'defense' ? 'Défense' : 
                           stat === 'specialAttack' ? 'Attaque Spé.' : 
                           stat === 'specialDefense' ? 'Défense Spé.' : 
                           stat === 'speed' ? 'Vitesse' : 
                           stat === 'total' ? 'TOTAL' : stat}</td>
                      <td className={values.winner === comparisonResult.pokemon1.name.french ? 'winner' : ''}>
                        {values.pokemon1}
                      </td>
                      <td className={values.winner === comparisonResult.pokemon2.name.french ? 'winner' : ''}>
                        {values.pokemon2}
                      </td>
                      <td>
                        {values.winner === 'Égalité' ? 'Égalité' : values.winner}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="type-advantages">
              <h3>Avantages de types</h3>
              
              <div className="advantage-columns">
                <div className="advantage-column">
                  <h4>Avantages de {comparisonResult.pokemon1.name.french}</h4>
                  {comparisonResult.typeAdvantage.pokemon1.effective.length > 0 && (
                    <div className="advantage-section">
                      <h5>Super efficace:</h5>
                      <ul>
                        {comparisonResult.typeAdvantage.pokemon1.effective.map((advantage, index) => (
                          <li key={`p1-eff-${index}`}>{advantage}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {comparisonResult.typeAdvantage.pokemon1.ineffective.length > 0 && (
                    <div className="advantage-section">
                      <h5>Pas très efficace:</h5>
                      <ul>
                        {comparisonResult.typeAdvantage.pokemon1.ineffective.map((advantage, index) => (
                          <li key={`p1-ineff-${index}`}>{advantage}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {comparisonResult.typeAdvantage.pokemon1.immune.length > 0 && (
                    <div className="advantage-section">
                      <h5>Immunité:</h5>
                      <ul>
                        {comparisonResult.typeAdvantage.pokemon1.immune.map((advantage, index) => (
                          <li key={`p1-immune-${index}`}>{advantage}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="advantage-column">
                  <h4>Avantages de {comparisonResult.pokemon2.name.french}</h4>
                  {comparisonResult.typeAdvantage.pokemon2.effective.length > 0 && (
                    <div className="advantage-section">
                      <h5>Super efficace:</h5>
                      <ul>
                        {comparisonResult.typeAdvantage.pokemon2.effective.map((advantage, index) => (
                          <li key={`p2-eff-${index}`}>{advantage}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {comparisonResult.typeAdvantage.pokemon2.ineffective.length > 0 && (
                    <div className="advantage-section">
                      <h5>Pas très efficace:</h5>
                      <ul>
                        {comparisonResult.typeAdvantage.pokemon2.ineffective.map((advantage, index) => (
                          <li key={`p2-ineff-${index}`}>{advantage}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {comparisonResult.typeAdvantage.pokemon2.immune.length > 0 && (
                    <div className="advantage-section">
                      <h5>Immunité:</h5>
                      <ul>
                        {comparisonResult.typeAdvantage.pokemon2.immune.map((advantage, index) => (
                          <li key={`p2-immune-${index}`}>{advantage}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonCompare; 