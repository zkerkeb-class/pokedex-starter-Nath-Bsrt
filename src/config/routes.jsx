import { createBrowserRouter } from "react-router-dom";
import Home from "../screens/home";
import Pokemon from "../screens/pokemon";
import Login from "../screens/login";  // Importing the Login page
import Register from "../screens/register";
import WhosThatPokemon from "../screens/wtp";  // Importation de la nouvelle page
import AddPokemon from "../screens/AddPokemon";  // Importation de la page d'ajout de Pokémon
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

// Composant Layout qui contient la navbar et le contenu principal
const Layout = () => {
  return (
    <div className="app-wrapper">
      <Navbar />
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
      }
    ]
  }
]);

export default router;

  