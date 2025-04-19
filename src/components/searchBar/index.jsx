import "./index.css";
import { typeImages } from "../../assets/typeImages"; // Import des images de types

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
    <div>
      <div className="search-bar-container">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="search-bar"
          type="text"
          placeholder="Rechercher un pokemon"
        />
      </div>
      <div className="types-filter-container">
        <div className="types-label">Filtrer par type:</div>
        <div className="types-buttons">
          {types.map((type) => {
            return (
              <button
                className={`type-filter-button ${selectedTypes.includes(type) ? "selected-type" : ""}`}
                onClick={() => {
                  if(selectedTypes.includes(type)){
                      setSelectedTypes(selectedTypes.filter((t) => t !== type))
                  }else{
                      setSelectedTypes([...selectedTypes, type]);
                  }
                }}
                key={type}
              >
                <img 
                  src={typeImages[type]} 
                  alt={type} 
                  className="type-filter-icon" 
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
