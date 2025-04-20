import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { typeImages } from "../assets/typeImages"; // Import des images de types
import "../App.css";
import "./wtp.css";
import Navbar from "../components/Navbar"; // Import de la Navbar

// URL de la musique du jeu (Remplacé par une URL plus fiable)
const POKEMON_MUSIC_URL = "https://play.pokemonshowdown.com/audio/dpp-trainer.mp3";

// Durée du jeu en secondes (60 secondes = 1 minute)
const GAME_DURATION = 60;

function WhosThatPokemon() {
  const { isAuthenticated, currentUser, logout, token } = useAuth();
  const navigate = useNavigate();
  const [pokemons, setPokemons] = useState([]);
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [options, setOptions] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameActive, setIsGameActive] = useState(false);
  const [pokemonCaught, setPokemonCaught] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  // Dummy state pour la navbar
  const [showFavorites, setShowFavorites] = useState(false);

  // Fonction dummy pour la navbar
  const toggleFavorites = () => {
    navigate('/');
  };

  // Vérifier si l'utilisateur est authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Charger les pokémons
  useEffect(() => {
    axios.get('http://localhost:3000/api/pokemons').then((response) => {
      setPokemons(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  // Charger le leaderboard
  const fetchLeaderboard = () => {
    axios.get('http://localhost:3000/api/auth/leaderboard')
      .then((response) => {
        setLeaderboard(response.data);
      })
      .catch((error) => {
        console.log("Erreur lors du chargement du leaderboard:", error);
      });
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Gérer le compte à rebours
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isGameActive) {
      setIsGameActive(false);
      setGameOver(true);
      // Sauvegarder le score quand le temps est écoulé
      saveScore();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isGameActive]);

  // Gérer la lecture/pause de la musique
  useEffect(() => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Erreur lors de la lecture de l'audio:", err);
          setMusicPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }

    // Nettoyer lors du démontage du composant
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [musicPlaying]);

  // Fonction pour obtenir un pokémon aléatoire
  const getRandomPokemon = () => {
    if (!pokemons || !Array.isArray(pokemons) || pokemons.length === 0) return null;
    return pokemons[Math.floor(Math.random() * pokemons.length)];
  };

  // Fonction pour générer 4 options dont une est correcte
  const generateOptions = (correctPokemon) => {
    if (!correctPokemon || !pokemons || !Array.isArray(pokemons) || pokemons.length < 4) return [];
    
    const options = [correctPokemon];
    while (options.length < 4) {
      const randomPokemon = getRandomPokemon();
      if (randomPokemon && !options.find(p => p.id === randomPokemon.id)) {
        options.push(randomPokemon);
      }
    }
    
    // Mélanger les options
    return options.sort(() => Math.random() - 0.5);
  };

  // Initialiser ou réinitialiser le jeu
  const startNewRound = () => {
    const pokemon = getRandomPokemon();
    setCurrentPokemon(pokemon);
    setOptions(generateOptions(pokemon));
    setRevealed(false);
  };

  // Démarrer le jeu
  const startGame = () => {
    setScore(0);
    setPokemonCaught(0);
    setTimeLeft(GAME_DURATION);
    setIsGameActive(true);
    setGameOver(false);
    setShowLeaderboard(false);
    startNewRound();
  };

  // Démarrer le jeu quand les pokémons sont chargés
  useEffect(() => {
    if (pokemons && Array.isArray(pokemons) && pokemons.length > 0 && !currentPokemon) {
      startNewRound();
    }
  }, [pokemons]);

  // Sauvegarder le score
  const saveScore = () => {
    if (!token || score === 0) return;  // Ne pas sauvegarder si le score est 0
    
    console.log('Sauvegarde du score:', { score, pokemonCaught });

    axios.put('http://localhost:3000/api/auth/score', 
      { 
        score: score,
        pokemonCaught: pokemonCaught
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    .then(response => {
      console.log('Score sauvegardé:', response.data);
      // Rafraîchir le leaderboard
      fetchLeaderboard();
    })
    .catch(error => {
      console.error('Erreur lors de la sauvegarde du score:', error);
    });
  };

  // Vérifier la réponse
  const checkAnswer = (selectedPokemon) => {
    setRevealed(true);
    
    if (selectedPokemon.id === currentPokemon.id) {
      setScore(score + 1);
      setPokemonCaught(pokemonCaught + 1);
    }
    
    // Passer au prochain pokémon après un délai
    setTimeout(() => {
      if (isGameActive) {
        startNewRound();
      }
    }, 1500);
  };

  // Toggle la musique
  const toggleMusic = () => {
    setMusicPlaying(!musicPlaying);
    
    // Si on active la musique, tentons de la jouer et affichons un message d'erreur si cela échoue
    if (!musicPlaying) {
      if (audioRef.current) {
        audioRef.current.play()
          .catch(err => {
            console.error("Erreur lors de la lecture de l'audio:", err);
            alert("Pour que la musique fonctionne, vous devez d'abord interagir avec la page (cliquer sur un bouton). C'est une restriction des navigateurs modernes pour l'autoplay.");
            setMusicPlaying(false);
          });
      }
    }
  };

  // Afficher le leaderboard
  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  // Formatage du temps (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Navbar
        user={currentUser}
        logout={logout}
        showFavorites={showFavorites}
        toggleFavorites={toggleFavorites}
        isWTPPage={true}
      />
      <div className="wtp-container">
        <h1>Qui est ce Pokémon?</h1>
        
        {/* Lecteur audio (caché) */}
        <audio ref={audioRef} src={POKEMON_MUSIC_URL} loop />
        
        {/* Bouton de contrôle de la musique */}
        <div className="music-control">
          <button 
            className={`music-button ${musicPlaying ? 'playing' : ''}`}
            onClick={toggleMusic}
          >
            {musicPlaying ? '🔊 Couper la musique' : '🔈 Jouer la musique'}
          </button>
        </div>
        
        {gameOver ? (
          <div className="game-over">
            <h2>Fin de la partie!</h2>
            <p>Votre score: {score}</p>
            <p>Pokémon identifiés: {pokemonCaught}</p>
            <button onClick={startGame}>Rejouer</button>
            <button onClick={toggleLeaderboard}>
              {showLeaderboard ? 'Cacher le leaderboard' : 'Voir le leaderboard'}
            </button>
            <button onClick={() => navigate("/")}>Retour à l'accueil</button>
            
            {showLeaderboard && (
              <div className="leaderboard">
                <h3>Meilleurs Scores</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Rang</th>
                      <th>Joueur</th>
                      <th>Score</th>
                      <th>Parties</th>
                      <th>Pokémon capturés</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((player, index) => (
                      <tr key={player._id} className={player.username === currentUser?.username ? 'current-user' : ''}>
                        <td>{index + 1}</td>
                        <td>{player.username}</td>
                        <td>{player.highScore}</td>
                        <td>{player.gamesPlayed}</td>
                        <td>{player.pokemonCaught}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : !isGameActive ? (
          <div className="game-start">
            <h2>Prêt à jouer?</h2>
            <p>Identifiez autant de Pokémon que possible en {GAME_DURATION} secondes!</p>
            <button onClick={startGame} className="start-button">Commencer la partie</button>
            <button onClick={toggleLeaderboard} className="leaderboard-button">
              {showLeaderboard ? 'Cacher le leaderboard' : 'Voir le leaderboard'}
            </button>
            
            {showLeaderboard && (
              <div className="leaderboard">
                <h3>Meilleurs Scores</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Rang</th>
                      <th>Joueur</th>
                      <th>Score</th>
                      <th>Parties</th>
                      <th>Pokémon capturés</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((player, index) => (
                      <tr key={player._id} className={player.username === currentUser?.username ? 'current-user' : ''}>
                        <td>{index + 1}</td>
                        <td>{player.username}</td>
                        <td>{player.highScore}</td>
                        <td>{player.gamesPlayed}</td>
                        <td>{player.pokemonCaught}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="game-header">
              <div className="score-display">Score: {score}</div>
              <div className="timer-display">Temps: {formatTime(timeLeft)}</div>
            </div>
            
            {currentPokemon && (
              <div className="pokemon-display">
                <div className={`pokemon-image ${revealed ? 'revealed' : 'silhouette'}`}>
                  <img 
                    src={currentPokemon.image} 
                    alt={revealed ? currentPokemon.name.french : "Silhouette de Pokémon"} 
                  />
                </div>
                
                {revealed && (
                  <div className="pokemon-name">
                    <p>C'est {currentPokemon.name.french}!</p>
                    <div className="revealed-types">
                      {currentPokemon.type && currentPokemon.type.map((type) => (
                        <div key={type} className="revealed-type-container">
                          <img 
                            src={typeImages[type]} 
                            alt={type} 
                            className="revealed-type-icon" 
                          />
                          <span className="revealed-type-name">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {!revealed && (
                  <div className="options-container">
                    {options.map((pokemon) => (
                      <button 
                        key={pokemon.id} 
                        onClick={() => checkAnswer(pokemon)}
                        className="option-button"
                      >
                        {pokemon.name.french}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default WhosThatPokemon; 