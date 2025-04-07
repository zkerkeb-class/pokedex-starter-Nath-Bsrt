import router from "./config/routes";
import { RouterProvider } from "react-router";


const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App;