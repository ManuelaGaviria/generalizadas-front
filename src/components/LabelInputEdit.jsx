import { useEffect } from "react"

function LabelInputEdit({texto,tipo,eventoCambio, valorInicial, id}) {

    useEffect(() => {
        document.getElementById(id).value = valorInicial;
        //eventoCambio(valorInicial);
    }, []);
    
    return (
      <div className="malla">
          <div className="columnaIzquierda">
              <label className="label">{texto}</label>
          </div>
          <div className="columnaDerecha">
              <input id={id} className="input" type={tipo} onChange={eventoCambio} />
          </div>
      </div>
    )
  }

  LabelInputEdit.defaultProps={
    valorInicial: ""
  }
  
  export default LabelInputEdit