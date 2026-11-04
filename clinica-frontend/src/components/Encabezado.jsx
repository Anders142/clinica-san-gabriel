import { useContext } from 'react'
import { ClinicaContext, RECEPCIONISTAS } from '../context/ClinicaContext.jsx'
import './Encabezado.css'

function Encabezado() {
  // Lee el contexto directamente, sin recibir props del padre.
  const { recepcionista, setRecepcionista, fechaTrabajo, setFechaTrabajo } =
    useContext(ClinicaContext)

  const nombreClinica = 'Clínica San Gabriel'
  return (
    <header className="encabezado">
      <div className="encabezado__marca">
        <img className="encabezado__logo" src="/logo-clinica.svg" alt="Logo de la clínica" />
        <div>
          <h1 className="encabezado__titulo">{nombreClinica}</h1>
          {/* Expresión JSX {}: fecha actual calculada en cada render */}
          <p className="encabezado__fecha">
            Hoy es{' '}
            {new Date().toLocaleDateString('es-PE', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="encabezado__contexto">
        <label>
          Recepcionista
          <select value={recepcionista} onChange={(e) => setRecepcionista(e.target.value)}>
            {RECEPCIONISTAS.map((nombre) => (
              <option key={nombre} value={nombre}>{nombre}</option>
            ))}
          </select>
        </label>
        <label>
          Fecha de trabajo
          <input type="date" value={fechaTrabajo} onChange={(e) => setFechaTrabajo(e.target.value)} />
        </label>
      </div>
    </header>
  )
}

export default Encabezado
