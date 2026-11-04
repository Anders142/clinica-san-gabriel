import Boton from './Boton.jsx'
import './ItemCita.css'

function ItemCita({ cita, seleccionada, onSeleccionar }) {
  return (
    <li className={`item-cita ${seleccionada ? 'item-cita--activa' : ''}`}>
      <div>
        <strong>{cita.fecha} · {cita.hora.slice(0, 5)}</strong>
        <p>{cita.paciente_nombre} → {cita.medico_nombre}</p>
      </div>
      <span className={`estado estado--${cita.estado_nombre}`}>{cita.estado_nombre}</span>
      {/* Hijo → padre: avisa el id de la cita elegida */}
      <Boton variante="secundario" onClick={() => onSeleccionar(cita.id)}>Ver detalle</Boton>
    </li>
  )
}

export default ItemCita
