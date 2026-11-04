import ItemCita from './ItemCita.jsx'
import './ListaCitas.css'

function ListaCitas({ citas, seleccionadaId, onSeleccionar }) {
  return (
    <section className="lista-citas">
      <h2>Citas ({citas.length})</h2>
      {citas.length === 0 ? (
        <p className="mensaje mensaje--info">Aún no hay citas registradas.</p>
      ) : (
        <ul>
          {citas.map((c) => (
            <ItemCita
              key={c.id}
              cita={c}
              seleccionada={c.id === seleccionadaId}
              onSeleccionar={onSeleccionar}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default ListaCitas
