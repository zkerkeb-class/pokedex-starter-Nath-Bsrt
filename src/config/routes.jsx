import { createBrowserRouter } from "react-router-dom";
import Home from "../screens/home/home";
import Pokemon from "../screens/pokemonDetails/pokemon";
import Login from "../screens/auth/login";  // Correct import from auth/login.jsx
import Register from "../screens/auth/register";  // Correct import from auth/register.jsx
import WhosThatPokemon from "../screens/wtp/wtp";  // Importation de la nouvelle page
import AddPokemon from "../screens/addPokemon/AddPokemon";  // Importation de la page d'ajout de Pokémon
import PokemonCompare from "../screens/compare/index";  // Importation de la page de comparaison
import { Outlet } from "react-router-dom";

// Composant Layout pour le contenu principal
const Layout = () => {
  return (
    <div className="app-wrapper">
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

let router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "pokemon/:id",
        element: <Pokemon />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "wtp",
        element: <WhosThatPokemon />,
      },
      {
        path: "add-pokemon",
        element: <AddPokemon />,
      },
      {
        path: "compare",
        element: <PokemonCompare />,
      }
    ]
  }
]);

export default router;

  