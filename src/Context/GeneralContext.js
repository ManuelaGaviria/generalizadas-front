import { createContext, useState } from "react";

const GeneralContext = createContext()

export const GeneralProvider = ({children}) => {

    const [nombre, setNombre] = useState("")
    const changeNombre = (e) => {
        setNombre(e.target.value)
    }

    const [cedula, setCedula] = useState("")
    const changeCedula = (e) => {
        setCedula(e.target.value)
    }

    const [edad, setEdad] = useState("")
    const changeEdad = (e) => {
        setEdad(e.target.value)
    }

    const [cedulaPadre, setCedulaPadre] = useState("")
    const changeCedulaPadre = (e) => {
        setCedulaPadre(e.target.value)
    }


    return <GeneralContext.Provider value={{
        nombre,changeNombre, 
        cedula, changeCedula,
        edad, changeEdad,
        cedulaPadre, changeCedulaPadre
    }}>
        {children}
    </GeneralContext.Provider>
}

export default GeneralContext