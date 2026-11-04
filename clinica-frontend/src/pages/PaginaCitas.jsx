import { useEffect, useState } from 'react'
import { getCitas, getEstados, getMedicos, getPacientes } from '../services/api.js'
import DetalleCita from '../components/DetalleCita.jsx'
import FormularioCita from '../components/FormularioCita.jsx'
import ListaCitas from '../components/ListaCitas.jsx'
import ResumenCitas from '../components/ResumenCitas.jsx'
import './Paginas.css'

const ordenar = (lista) =>
  [...lista].sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))

// Componente padre: concentra el estado compartido y lo reparte a los hijos.
function PaginaCitas() {
  const [citas, setCitas] = useState([])
  const [medicos, setMedicos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [estados, setEstados] = useState([])
  const [seleccionadaId, setSeleccionadaId] = useState(null) // estado elevado
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getCitas(), getMedicos(), getPacientes(), getEstados()])
      .then(([c, m, p, e]) => {
        setCitas(ordenar(c)); setMedicos(m); setPacientes(p); setEstados(e)
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  // Callback de FormularioCita: agrega la cita sin recargar la página.
  function handleCitaCreada(cita) {
    setCitas((prev) => ordenar([...prev, cita]))
    setSeleccionadaId(cita.id)
  }

  // Callback de DetalleCita: reemplaza la cita; lista y resumen se re-renderizan.
  function handleCambiarEstado(citaActualizada) {
    setCitas((prev) => prev.map((c) => (c.id === citaActualizada.id ? citaActualizada : c)))
  }

  if (cargando) return <p>Cargando…</p>
  if (error) return <p className="mensaje mensaje--error">No se pudo cargar la página: {error}</p>

  const seleccionada = citas.find((c) => c.id === seleccionadaId) ?? null

  return (
    <div className="pagina-citas">
      <ResumenCitas citas={citas} estados={estados} />
      <div className="pagina-grid pagina-grid--2">
        <FormularioCita
          medicos={medicos}
          pacientes={pacientes}
          estados={estados}
          onCitaCreada={handleCitaCreada}
        />
        {/* DetalleCita es hermano de ListaCitas: ambos dependen del estado del padre */}
        <DetalleCita cita={seleccionada} estados={estados} onCambiarEstado={handleCambiarEstado} />
      </div>
      <ListaCitas citas={citas} seleccionadaId={seleccionadaId} onSeleccionar={setSeleccionadaId} />
    </div>
  )
}

export default PaginaCitas
