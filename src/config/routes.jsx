import { createBrowserRouter } from "react-router";
import Home from "../screens/home";
import Pokemon from "../screens/pokemon";
import Login from "../screens/login";  // Importing the Login page

let router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/pokemon/:id",
    Component: Pokemon,
  },
  {
    path: "/login",  // Adding the login route
    Component: Login,
  },
]);

export default router;

  