import { useEffect, useState } from 'react'
import { eliminarPaciente, getPacientes, mensajeDeError } from '../services/api.js'
import BuscadorPacientes from '../components/BuscadorPacientes.jsx'
import FormularioPaciente from '../components/FormularioPaciente.jsx'
import TablaPacientes from '../components/TablaPacientes.jsx'
import './Paginas.css'

function PaginaPacientes() {
  const [pacientes, setPacientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getPacientes()
      .then(setPacientes)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  async function handleEliminar(paciente) {
    if (!window.confirm(`¿Eliminar al paciente ${paciente.nombres}? Se borrarán también sus citas.`)) return
    try {
      await eliminarPaciente(paciente.id) // DELETE /api/pacientes/<id>/
      setPacientes((prev) => prev.filter((p) => p.id !== paciente.id))
    } catch (err) {
      setError(mensajeDeError(err))
    }
  }

  // Filtrado derivado del estado: no hace falta otro useState.
  const texto = busqueda.trim().toLowerCase()
  const filtrados = pacientes.filter(
    (p) => p.nombres.toLowerCase().includes(texto) || p.dni.includes(texto),
  )

  return (
    <div className="pagina-grid pagina-grid--2">
      <FormularioPaciente onPacienteCreado={(nuevo) => setPacientes((prev) => [...prev, nuevo])} />
      <section>
        <h2>Pacientes ({filtrados.length})</h2>
        <BuscadorPacientes valor={busqueda} onCambio={setBusqueda} onLimpiar={() => setBusqueda('')} />
        {cargando && <p>Cargando…</p>}
        {error && <p className="mensaje mensaje--error">{error}</p>}
        {!cargando && <TablaPacientes pacientes={filtrados} onEliminar={handleEliminar} />}
      </section>
    </div>
  )
}

export default PaginaPacientes
