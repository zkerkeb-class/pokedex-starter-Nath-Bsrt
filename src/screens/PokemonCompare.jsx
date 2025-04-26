import React, { useState, useEffect } from 'react';
import { getAllPokemon, comparePokemon } from './apiService';
import './PokemonCompare.css';

const PokemonCompare = () => {
  const [allPokemon, setAllPokemon] = useState([]);
  const [selectedPokemon1, setSelectedPokemon1] = useState('');
  const [selectedPokemon2, setSelectedPokemon2] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all Pokemon on component mount
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const data = await getAllPokemon();
        setAllPokemon(data);
      } catch (err) {
        setError('Failed to load Pokémon. Please try again later.');
        console.error(err);
      }
    };

    fetchPokemon();
  }, []);

  // Handle comparison
  const handleCompare = async () => {
    if (!selectedPokemon1 || !selectedPokemon2) {
      setError('Please select two Pokémon to compare.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await comparePokemon(selectedPokemon1, selectedPokemon2);
      setComparisonResult(result);
    } catch (err) {
      setError('Failed to compare Pokémon. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get Pokemon name in French
  const getPokemonName = (id) => {
    const pokemon = allPokemon.find(p => p.id === parseInt(id));
    return pokemon ? pokemon.name.french : `Pokémon #${id}`;
  };

  return (
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
              <h3>{getPokemonName(selectedPokemon1)}</h3>
              <div className="pokemon-image">
                <img 
                  src={`/assets/pokemons/${selectedPokemon1}.png`} 
                  alt={getPokemonName(selectedPokemon1)} 
                />
              </div>
              <div className="pokemon-types">
                {comparisonResult.pokemon1.types.map((type, index) => (
                  <span key={`p1-type-${index}`} className={`type type-${type.toLowerCase()}`}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="versus">VS</div>
            
            <div className="pokemon-card">
              <h3>{getPokemonName(selectedPokemon2)}</h3>
              <div className="pokemon-image">
                <img 
                  src={`/assets/pokemons/${selectedPokemon2}.png`} 
                  alt={getPokemonName(selectedPokemon2)} 
                />
              </div>
              <div className="pokemon-types">
                {comparisonResult.pokemon2.types.map((type, index) => (
                  <span key={`p2-type-${index}`} className={`type type-${type.toLowerCase()}`}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="comparison-stats">
            <h3>Statistiques</h3>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Statistique</th>
                  <th>{getPokemonName(selectedPokemon1)}</th>
                  <th>{getPokemonName(selectedPokemon2)}</th>
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
                    <td className={values.winner === comparisonResult.pokemon1.name?.french ? 'winner' : ''}>
                      {values.pokemon1}
                    </td>
                    <td className={values.winner === comparisonResult.pokemon2.name?.french ? 'winner' : ''}>
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
                <h4>Avantages de {getPokemonName(selectedPokemon1)}</h4>
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
                <h4>Avantages de {getPokemonName(selectedPokemon2)}</h4>
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
          
          <div className="final-result">
            <h3>Résultat Final</h3>
            <div className="winner-display">
              <span>Vainqueur: </span>
              <strong>
                {comparisonResult.overallWinner === 'Égalité' 
                  ? 'Égalité' 
                  : comparisonResult.overallWinner}
              </strong>
              <div className="scores">
                <span>{getPokemonName(selectedPokemon1)}: {comparisonResult.scores.pokemon1} points</span>
                <span>{getPokemonName(selectedPokemon2)}: {comparisonResult.scores.pokemon2} points</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonCompare; 