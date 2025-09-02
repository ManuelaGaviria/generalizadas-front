function LabelInput({texto,tipo,eventoCambio}) {
    
    return (
      <div className="malla">
          <div className="columnaIzquierda">
              <label className="label">{texto}</label>
          </div>
          <div className="columnaDerecha">
              <input className="input" type={tipo} onChange={eventoCambio}/>
          </div>
      </div>
    )
  }
  
  export default LabelInput