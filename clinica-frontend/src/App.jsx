import { useEffect, useState } from 'react'
import { getEspecialidades } from './services/api.js'
import Encabezado from './components/Encabezado.jsx'
import PiePagina from './components/PiePagina.jsx'
import PaginaCitas from './pages/PaginaCitas.jsx'
import PaginaMedicos from './pages/PaginaMedicos.jsx'
import PaginaPacientes from './pages/PaginaPacientes.jsx'
import './App.css'

function App() {
  const [vista, setVista] = useState('inicio')
  const [especialidades, setEspecialidades] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Se ejecuta una vez, al montar el componente ([] como dependencias).
  useEffect(() => {
    getEspecialidades()
      .then((datos) => setEspecialidades(datos))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  const secciones = [
    ['inicio', 'Inicio'], ['pacientes', 'Pacientes'],
    ['medicos', 'Médicos'], ['citas', 'Citas'],
  ]

  return (
    <>
      <Encabezado />
      <nav className="menu">
        {secciones.map(([clave, texto]) => (
          <button
            key={clave}
            className={vista === clave ? 'menu__boton menu__boton--activo' : 'menu__boton'}
            onClick={() => setVista(clave)}
          >
            {texto}
          </button>
        ))}
      </nav>

      <main className="pagina">
        {vista === 'inicio' && (
          <section>
            <h2>Nuestras especialidades</h2>
            {/* Renderizado condicional: cargando / error / datos */}
            {cargando && <p>Cargando…</p>}
            {error && <p className="mensaje mensaje--error">No se pudo conectar con la API: {error}</p>}
            {!cargando && !error && (
              <ul className="especialidades">
                {especialidades.map((esp) => (
                  <li key={esp.id} className="especialidades__item">
                    <h3>{esp.nombre}</h3>
                    <p>{esp.descripcion || 'Sin descripción.'}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
        {vista === 'pacientes' && <PaginaPacientes />}
        {vista === 'medicos' && <PaginaMedicos />}
        {vista === 'citas' && <PaginaCitas />}
      </main>

      <PiePagina />
    </>
  )
}

export default App
