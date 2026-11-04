import { useEffect, useState } from 'react'
import { getMedicos } from '../services/api.js'
import TarjetaMedico from './TarjetaMedico.jsx'
import './FiltroEspecialidad.css'

function FiltroEspecialidad({ especialidades }) {
  const [especialidadId, setEspecialidadId] = useState('') // '' = todas
  const [medicos, setMedicos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Cada vez que cambia el select se consulta /api/medicos/?especialidad=<id>
  useEffect(() => {
    let cancelado = false
    setCargando(true)
    getMedicos(especialidadId)
      .then((datos) => { if (!cancelado) { setMedicos(datos); setError('') } })
      .catch((err) => { if (!cancelado) setError(err.message) })
      .finally(() => { if (!cancelado) setCargando(false) })
    return () => { cancelado = true }
  }, [especialidadId])

  return (
    <section className="filtro-esp">
      <div className="filtro-esp__barra">
        <label htmlFor="filtro-esp">Especialidad</label>
        <select
          id="filtro-esp"
          value={especialidadId}
          onChange={(e) => setEspecialidadId(e.target.value)}
        >
          <option value="">Todas</option>
          {especialidades.map((e) => (
            <option key={e.id} value={e.id}>{e.nombre}</option>
          ))}
        </select>
        <strong>Médicos mostrados: {medicos.length}</strong>
      </div>

      {cargando && <p>Cargando…</p>}
      {error && <p className="mensaje mensaje--error">{error}</p>}
      {!cargando && !error && medicos.length === 0 && (
        <p className="mensaje mensaje--info">No hay médicos en esta especialidad.</p>
      )}
      <div className="filtro-esp__grid">
        {medicos.map((m) => (
          <TarjetaMedico
            key={m.id}
            nombres={m.nombres}
            cmp={m.cmp}
            especialidad={m.especialidad_nombre}
          />
        ))}
      </div>
    </section>
  )
}

export default FiltroEspecialidad
