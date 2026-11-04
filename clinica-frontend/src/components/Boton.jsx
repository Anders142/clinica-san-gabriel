import './Boton.css'

// Props desestructuradas: texto, variante, onClick, children y extras.
// Se puede usar <Boton texto="Guardar" /> o <Boton>Guardar</Boton>.
function Boton({ texto, variante = 'primario', onClick, children, type = 'button', disabled = false }) {
  return (
    <button
      type={type}
      className={`boton boton--${variante}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children ?? texto}
    </button>
  )
}

export default Boton
