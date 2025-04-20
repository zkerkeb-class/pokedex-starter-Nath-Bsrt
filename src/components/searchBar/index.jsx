import "./index.css";
import { typeImages } from "../../assets/typeImages"; // Import des images de types
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const types = [
  "Bug",
  "Dark",
  "Dragon",
  "Electric",
  "Fairy",
  "Fighting",
  "Fire",
  "Flying",
  "Ghost",
  "Grass",
  "Ground",
  "Ice",
  "Normal",
  "Poison",
  "Psychic",
  "Rock",
  "Steel",
  "Water",
];

const SearchBar = ({ search, setSearch, selectedTypes, setSelectedTypes }) => {
  return (
    <div className="search-container">
      <div className="search-input-container">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="search-input"
          type="text"
          placeholder="Rechercher un pokemon"
        />
      </div>
      <div className="types-filter">
        {types.map((type) => (
          <button
            key={type}
            className={`type-button ${selectedTypes.includes(type) ? "active" : ""}`}
            onClick={() => {
              if(selectedTypes.includes(type)){
                setSelectedTypes(selectedTypes.filter((t) => t !== type))
              } else {
                setSelectedTypes([...selectedTypes, type]);
              }
            }}
            title={type}
          >
            <img 
              src={typeImages[type]} 
              alt={type} 
              className="type-icon" 
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
