import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { typeImages } from "../assets/typeImages"; // Import des images de types
import "./pokemon.css"; // Import du CSS

const Pokemon = () => {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState({});
    const [evolutions, setEvolutions] = useState([]);
    const [isShiny, setIsShiny] = useState(false);

    const toggleShiny = () => {
        setIsShiny(!isShiny);
    };

    useEffect(() => {
        // Récupération du Pokémon
        axios.get(`http://localhost:3000/api/pokemons/${id}`).then((response) => {
            console.log("🚀 ~ Pokemon ~ response:", response.data);
            setPokemon(response.data);
            
            // Recherche des évolutions
            fetchEvolutions(response.data);
        }).catch((error) => {
            console.log("🚀 ~ Pokemon ~ error:", error);
        });
    }, [id]);

    // Fonction pour récupérer les évolutions
    const fetchEvolutions = async (currentPokemon) => {
        try {
            // Déterminer les évolutions possibles (IDs consécutifs pour les chaînes d'évolution simples)
            // Pour une solution plus complète, vous auriez besoin d'une API avec des données d'évolution spécifiques
            const evolutionChain = [];
            
            // Recherche de pré-évolution (ID-1, si ID > 1)
            if (currentPokemon.id > 1) {
                try {
                    const preEvolution = await axios.get(`http://localhost:3000/api/pokemons/${currentPokemon.id - 1}`);
                    // Vérifier si c'est une évolution (même famille)
                    // La vérification est simplifiée - idéalement, utilisez une API avec des données d'évolution complètes
                    if (preEvolution.data.type[0] === currentPokemon.type[0]) {
                        evolutionChain.push(preEvolution.data);
                    }
                } catch (error) {
                    console.log("Pas de pré-évolution trouvée");
                }
            }
            
            // Ajouter le Pokémon actuel
            evolutionChain.push(currentPokemon);
            
            // Recherche d'évolution (ID+1)
            try {
                const evolution = await axios.get(`http://localhost:3000/api/pokemons/${currentPokemon.id + 1}`);
                // Vérifier si c'est une évolution (même famille)
                if (evolution.data.type[0] === currentPokemon.type[0]) {
                    evolutionChain.push(evolution.data);
                }
            } catch (error) {
                console.log("Pas d'évolution trouvée");
            }
            
            // Mettre à jour le state avec les évolutions trouvées
            setEvolutions(evolutionChain);
        } catch (error) {
            console.error("Erreur lors de la récupération des évolutions", error);
        }
    };

    // Chemin vers l'image normale ou shiny
    const getImagePath = () => {
        if (isShiny) {
            return pokemon.image?.replace('/pokemons/', '/pokemons/shiny/');
        }
        return pokemon.image;
    };

    return (
        <div className="pokemon-detail-container">
            <h1 className="pokemon-title">{pokemon.name?.french}</h1>
            
            <div className="pokemon-main-info">
                <div className="pokemon-image-container">
                    <img src={getImagePath()} alt={pokemon.name?.french} className="pokemon-detail-image" />
                    <button 
                        className={`shiny-button ${isShiny ? 'active' : ''}`} 
                        onClick={toggleShiny}
                    >
                        {isShiny ? 'Version Normale' : 'Version Shiny ✨'}
                    </button>
                </div>
                
                <div className="pokemon-info-container">
                    <div className="pokemon-types-detail">
                        <h3>Types:</h3>
                        <div className="types-icons-container">
                            {pokemon.type && pokemon.type.map((type) => (
                                <div key={type} className="type-detail-container">
                                    <img 
                                        src={typeImages[type]} 
                                        alt={type} 
                                        className="type-detail-image" 
                                    />
                                    <span className="type-detail-name">{type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="pokemon-stats">
                        <h3>Statistiques:</h3>
                        <div className="stat-row">
                            <span className="stat-label">HP:</span>
                            <span className="stat-value">{pokemon.base?.HP}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Attaque:</span>
                            <span className="stat-value">{pokemon.base?.Attack}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Défense:</span>
                            <span className="stat-value">{pokemon.base?.Defense}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Attaque Spéciale:</span>
                            <span className="stat-value">{pokemon.base?.["Sp. Attack"]}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Défense Spéciale:</span>
                            <span className="stat-value">{pokemon.base?.["Sp. Defense"]}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Vitesse:</span>
                            <span className="stat-value">{pokemon.base?.Speed}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Évolutions */}
            {evolutions.length > 1 && (
                <div className="pokemon-evolutions">
                    <h3>Chaîne d'évolution:</h3>
                    <div className="evolutions-container">
                        {evolutions.map((evo) => (
                            <div key={evo.id} className={`evolution-item ${evo.id === parseInt(id) ? 'current' : ''}`}>
                                <img 
                                    src={isShiny ? evo.image?.replace('/pokemons/', '/pokemons/shiny/') : evo.image} 
                                    alt={evo.name?.french} 
                                    className="evolution-image" 
                                />
                                <span className="evolution-name">{evo.name?.french}</span>
                                {evo.id !== evolutions[evolutions.length - 1].id && (
                                    <div className="evolution-arrow">→</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="pokemon-names">
                <h3>Noms dans d'autres langues:</h3>
                <div className="names-container">
                    <div className="name-item">
                        <span className="name-label">Anglais:</span>
                        <span className="name-value">{pokemon.name?.english}</span>
                    </div>
                    <div className="name-item">
                        <span className="name-label">Japonais:</span>
                        <span className="name-value">{pokemon.name?.japanese}</span>
                    </div>
                    <div className="name-item">
                        <span className="name-label">Chinois:</span>
                        <span className="name-value">{pokemon.name?.chinese}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pokemon;