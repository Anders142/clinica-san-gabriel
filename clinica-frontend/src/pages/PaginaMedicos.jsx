import { useEffect, useState } from 'react'
import { getEspecialidades } from '../services/api.js'
import FiltroEspecialidad from '../components/FiltroEspecialidad.jsx'

function PaginaMedicos() {
  const [especialidades, setEspecialidades] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getEspecialidades().then(setEspecialidades).catch((err) => setError(err.message))
  }, [])

  return (
    <section>
      <h2>Médicos</h2>
      {error && <p className="mensaje mensaje--error">{error}</p>}
      <FiltroEspecialidad especialidades={especialidades} />
    </section>
  )
}

export default PaginaMedicos
