import Boton from './Boton.jsx'
import './TablaPacientes.css'

function TablaPacientes({ pacientes, onEliminar }) {
  if (pacientes.length === 0) {
    return <p className="mensaje mensaje--info">No hay pacientes que coincidan.</p>
  }
  return (
    <table className="tabla-pacientes">
      <thead>
        <tr><th>DNI</th><th>Nombres</th><th>Nacimiento</th><th>Teléfono</th><th>Correo</th><th></th></tr>
      </thead>
      <tbody>
        {pacientes.map((p) => (
          <tr key={p.id}>
            <td>{p.dni}</td>
            <td>{p.nombres}</td>
            <td>{p.fecha_nacimiento}</td>
            <td>{p.telefono || '—'}</td>
            <td>{p.correo || '—'}</td>
            <td>
              {/* Función flecha: onEliminar(p) se ejecuta al hacer clic, no al renderizar */}
              <Boton variante="peligro" onClick={() => onEliminar(p)}>Eliminar</Boton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TablaPacientes
