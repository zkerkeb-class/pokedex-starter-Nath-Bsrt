import "./index.css";

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
      <div>
        {types.map((type) => {
          return (
            <button
              className={selectedTypes.includes(type) ? "selected-type" : ""}
              onClick={() => {
                if(selectedTypes.includes(type)){
                    setSelectedTypes(selectedTypes.filter((t) => t !== type))
                }else{
                    setSelectedTypes([...selectedTypes, type]);
                }
              }}
              key={type}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchBar;
