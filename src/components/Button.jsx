function Button({eventoClick, children, clase}) {
    return (
      <div>
          <button className={clase} onClick={eventoClick}>{children}</button>
      </div>
    )
  }
  
  const vacio = () => {} 
  
  Button.defaultProps={
    eventoClick:vacio
  }
  
  export default Button