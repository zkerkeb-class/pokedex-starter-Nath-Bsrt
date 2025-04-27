import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { typeImages } from "../../assets/typeImages"; // Import des images de types
import Navbar from "../../components/Navbar"; // Import de la navbar
import { useAuth } from "../../context/AuthContext"; // Importer useAuth
import "./pokemon.css"; // Import du CSS
import getEvolutionChain from "../../data/evolution-chains"; // Import des chaînes d'évolution

const Pokemon = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth(); // Récupérer l'utilisateur et la fonction de déconnexion
    const [pokemon, setPokemon] = useState({});
    const [evolutions, setEvolutions] = useState([]);
    const [isShiny, setIsShiny] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Dummy state pour la navbar
    const [showFavorites, setShowFavorites] = useState(false);

    // Fonction dummy pour la navbar
    const toggleFavorites = () => {
        navigate('/');
    };

    const toggleShiny = () => {
        setIsShiny(!isShiny);
    };

    // Transformer un pokémon personnalisé au format attendu par l'interface
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
            isCustom: true
        };
    };

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        const numericId = parseInt(id);
        
        // Vérifier si c'est un ID de Pokémon personnalisé (supérieur à 10000)
        if (numericId >= 10000) {
            // Charger les Pokémon personnalisés du localStorage
            const customPokemonJSON = localStorage.getItem('customPokemon');
            
            if (customPokemonJSON) {
                try {
                    const customPokemons = JSON.parse(customPokemonJSON);
                    const foundPokemon = customPokemons.find(p => p.id === numericId);
                    
                    if (foundPokemon) {
                        const formattedPokemon = transformCustomPokemon(foundPokemon);
                        setPokemon(formattedPokemon);
                        setEvolutions([formattedPokemon]); // Pas d'évolution pour les Pokémon personnalisés
                        setLoading(false);
                    } else {
                        setError("Pokémon personnalisé non trouvé");
                        setLoading(false);
                    }
                } catch (error) {
                    console.error("Erreur lors du chargement des Pokémon personnalisés:", error);
                    setError("Erreur lors du chargement du Pokémon personnalisé");
                    setLoading(false);
                }
            } else {
                setError("Aucun Pokémon personnalisé trouvé");
                setLoading(false);
            }
        } else {
            // Plan B: Récupérer tous les pokémons depuis la page d'accueil
            try {
                // Récupération du Pokémon depuis l'API
                axios.get(`http://localhost:3000/api/pokemons/${id}`)
                    .then((response) => {
                        console.log("Réponse de l'API Pokémon:", response.data);
                        setPokemon(response.data);
                        
                        // Recherche des évolutions avec notre nouvelle fonction
                        fetchAccurateEvolutions(response.data);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error("Erreur API:", error);
                        
                        // Plan B: Tenter de récupérer tous les pokémons
                        console.log("Tentative de récupération depuis l'API principale...");
                        axios.get('http://localhost:3000/api/pokemons')
                            .then(allPokemonsResponse => {
                                const allPokemons = allPokemonsResponse.data;
                                const foundPokemon = allPokemons.find(p => p.id === numericId);
                                
                                if (foundPokemon) {
                                    console.log("Pokémon trouvé dans la liste complète:", foundPokemon);
                                    setPokemon(foundPokemon);
                                    
                                    // Même ici, recherchons les évolutions correctes
                                    fetchAccurateEvolutions(foundPokemon);
                                    setLoading(false);
                                } else {
                                    setError("Pokémon non trouvé");
                                    setLoading(false);
                                }
                            })
                            .catch(allPokemonsError => {
                                console.error("Erreur lors de la récupération de tous les Pokémon:", allPokemonsError);
                                setError("Erreur lors du chargement du Pokémon. Veuillez vérifier que l'API est bien démarrée.");
                                setLoading(false);
                            });
                    });
            } catch (error) {
                console.error("Exception:", error);
                setError("Une erreur inattendue s'est produite");
                setLoading(false);
            }
        }
    }, [id]);

    // Nouvelle fonction pour récupérer les évolutions précises
    const fetchAccurateEvolutions = async (currentPokemon) => {
        try {
            // Récupérer la chaîne d'évolution correcte depuis notre fichier de données
            const evolutionChainIds = getEvolutionChain(currentPokemon.id);
            console.log("Chaîne d'évolution trouvée:", evolutionChainIds);

            // Si nous n'avons qu'un seul Pokémon dans la chaîne (lui-même), pas besoin de requêtes supplémentaires
            if (evolutionChainIds.length === 1) {
                setEvolutions([currentPokemon]);
                return;
            }

            // Récupérer les données de tous les Pokémon de la chaîne d'évolution
            const evolutionPokemons = [];
            
            // Récupération des informations pour chaque Pokémon de la chaîne
            await Promise.all(evolutionChainIds.map(async (evoId) => {
                try {
                    // Si c'est l'ID du Pokémon actuel, utilisons directement les données que nous avons déjà
                    if (evoId === currentPokemon.id) {
                        evolutionPokemons.push(currentPokemon);
                    } else {
                        // Sinon, récupérer les données depuis l'API
                        const response = await axios.get(`http://localhost:3000/api/pokemons/${evoId}`);
                        evolutionPokemons.push(response.data);
                    }
                } catch (error) {
                    console.log(`Erreur lors de la récupération du Pokémon ID ${evoId}:`, error);
                }
            }));

            // Trier les Pokémon dans l'ordre de la chaîne d'évolution
            const sortedEvolutions = evolutionChainIds
                .map(evoId => evolutionPokemons.find(p => p.id === evoId))
                .filter(Boolean); // Filtrer les undefined (en cas d'erreur de récupération)

            // Mettre à jour le state avec les évolutions
            setEvolutions(sortedEvolutions);
        } catch (error) {
            console.error("Erreur lors de la récupération des évolutions précises", error);
            // En cas d'erreur, au moins montrer le Pokémon actuel
            setEvolutions([currentPokemon]);
        }
    };

    // Chemin vers l'image normale ou shiny
    const getImagePath = () => {
        if (!pokemon || !pokemon.image) return '';
        
        if (isShiny && !pokemon.isCustom) {
            return pokemon.image.replace('/pokemons/', '/pokemons/shiny/');
        }
        return pokemon.image;
    };

    if (loading) {
        return (
            <>
                <Navbar 
                    showFavorites={showFavorites}
                    toggleFavorites={toggleFavorites}
                    user={currentUser}
                    logout={logout}
                />
                <div className="pokemon-detail-container loading">
                    <p>Chargement...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar 
                    showFavorites={showFavorites}
                    toggleFavorites={toggleFavorites}
                    user={currentUser}
                    logout={logout}
                />
                <div className="pokemon-detail-container error">
                    <h2>Erreur</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/')} className="return-button">
                        Retour à l'accueil
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar 
                showFavorites={showFavorites}
                toggleFavorites={toggleFavorites}
                user={currentUser}
                logout={logout}
            />
            <div className="pokemon-detail-container">
                <h1 className="pokemon-title">{pokemon.name?.french}</h1>
                
                <div className="pokemon-main-info">
                    <div className="pokemon-image-container">
                        <img src={getImagePath()} alt={pokemon.name?.french} className="pokemon-detail-image" />
                        {!pokemon.isCustom && (
                            <button 
                                className={`shiny-button ${isShiny ? 'active' : ''}`} 
                                onClick={toggleShiny}
                            >
                                {isShiny ? 'Version Normale' : 'Version Shiny ✨'}
                            </button>
                        )}
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
                
                {/* Évolutions - Afficher pour tous les Pokémon avec une chaîne d'évolution de plus d'un élément */}
                {evolutions.length > 1 && (
                    <div className="pokemon-evolutions">
                        <h3>Chaîne d'évolution:</h3>
                        <div className="evolutions-container">
                            {evolutions.map((evo, index) => (
                                <div key={evo.id} className={`evolution-item ${evo.id === parseInt(id) ? 'current' : ''}`}>
                                    <img 
                                        src={isShiny ? evo.image?.replace('/pokemons/', '/pokemons/shiny/') : evo.image} 
                                        alt={evo.name?.french} 
                                        className="evolution-image" 
                                        onClick={() => evo.id !== parseInt(id) && navigate(`/pokemon/${evo.id}`)}
                                        style={{ cursor: evo.id !== parseInt(id) ? 'pointer' : 'default' }}
                                    />
                                    <span className="evolution-name">{evo.name?.french}</span>
                                    {index !== evolutions.length - 1 && (
                                        <div className="evolution-arrow">→</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Badge pour les Pokémon personnalisés */}
                {pokemon.isCustom && (
                    <div className="custom-pokemon-badge">
                        Pokémon personnalisé
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
                
                <div className="back-to-home">
                    <button onClick={() => navigate('/')} className="return-button">
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        </>
    )
}

export default Pokemon;