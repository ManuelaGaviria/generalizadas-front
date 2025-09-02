
import {BrowserRouter as Router} from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { GeneralProvider } from "./Context/GeneralContext";

function App() {
  return (
    <GeneralProvider>
      <Router><AppRoutes></AppRoutes></Router>
    </GeneralProvider>
  );
}

export default App;