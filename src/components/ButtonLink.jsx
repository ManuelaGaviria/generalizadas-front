import {Link} from "react-router-dom"

function ButtonLink({children,destino, clase, eventoClick}) {

  return (
    <Link to={destino}>
        <button onClick={eventoClick} className={clase}>{children}</button>
    </Link>
  )
}

const vacio = () => {} 
  
  ButtonLink.defaultProps={
    eventoClick:vacio
  }

export default ButtonLink