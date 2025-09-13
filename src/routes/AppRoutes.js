import {Route,Routes, useLocation} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Principal from "../pages/Principal";
import Personas from "../pages/Personas/Personas";
import Estructura from "../pages/Estructura/Estructura";
import EliminarNivel from "../pages/Eliminar/EliminarNivel";
import CrearPersonas from "../pages/Personas/CrearPersonas";
import VerPersonas from "../pages/Personas/VerPersonas";
import ConsultaRelaciones from "../pages/Relaciones/ConsultaRelaciones";
import VerArbol from "../pages/VerArbol";

function AppRoutes() {
    const location = useLocation();
  return (
    <>
        <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
                <Route exact path="/" element={<Principal></Principal>}></Route>
                <Route exact path="/personas" element={<Personas></Personas>}></Route>
                <Route exact path="/crearPersonas" element={<CrearPersonas></CrearPersonas>}></Route>
                <Route exact path="/verPersonas" element={<VerPersonas></VerPersonas>}></Route>
                <Route exact path="/verArbol" element={<VerArbol></VerArbol>}></Route>

                <Route exact path="/relaciones" element={<ConsultaRelaciones></ConsultaRelaciones>}></Route>
                <Route exact path="/estructura" element={<Estructura></Estructura>}></Route>
                <Route exact path="/eliminarNiveles" element={<EliminarNivel></EliminarNivel>}></Route>
            </Routes>
        </AnimatePresence>
    </>
    
  )
}

export default AppRoutes