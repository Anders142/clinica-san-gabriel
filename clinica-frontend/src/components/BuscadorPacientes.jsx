import Boton from './Boton.jsx'
import './BuscadorPacientes.css'

// Componente controlado desde el padre: recibe el texto y avisa los cambios.
function BuscadorPacientes({ valor, onCambio, onLimpiar }) {
  return (
    <div className="buscador">
      <input
        type="search"
        placeholder="Buscar por nombre o DNI…"
        value={valor}
        onChange={(e) => onCambio(e.target.value)} // filtra mientras se escribe
      />
      <Boton variante="secundario" onClick={onLimpiar}>Limpiar</Boton>
    </div>
  )
}

export default BuscadorPacientes
