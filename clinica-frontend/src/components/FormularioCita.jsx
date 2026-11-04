import { useContext, useEffect, useState } from 'react'
import { ClinicaContext } from '../context/ClinicaContext.jsx'
import { crearCita, mensajeDeError } from '../services/api.js'
import Boton from './Boton.jsx'
import './FormularioCita.css'

function FormularioCita({ medicos, pacientes, estados, onCitaCreada }) {
  // Datos compartidos por Context: no llegan por props.
  const { recepcionista, fechaTrabajo } = useContext(ClinicaContext)

  const [form, setForm] = useState({
    paciente: '', medico: '', fecha: fechaTrabajo, hora: '', motivo: '',
  })
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Si la recepcionista cambia la fecha de trabajo, el formulario la sigue.
  useEffect(() => {
    setForm((f) => ({ ...f, fecha: fechaTrabajo }))
  }, [fechaTrabajo])

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setExito('')
    const pendiente = estados.find((e) => e.nombre === 'pendiente')
    setEnviando(true)
    try {
      const cita = await crearCita({ ...form, estado: pendiente?.id }) // POST /api/citas/
      onCitaCreada(cita) // hijo → padre: el padre la agrega a su estado
      setExito(`Cita registrada por ${recepcionista}.`)
      setForm({ ...form, hora: '', motivo: '' })
    } catch (err) {
      // Si el backend responde 400 se muestra el mensaje que devuelve.
      setError(mensajeDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="form-cita" onSubmit={handleSubmit}>
      <h2>Reservar cita</h2>
      <p className="form-cita__recep">Registra: <strong>{recepcionista}</strong></p>

      <label htmlFor="cita-paciente">Paciente</label>
      <select id="cita-paciente" name="paciente" value={form.paciente} onChange={handleChange} required>
        <option value="">— Seleccione —</option>
        {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nombres} ({p.dni})</option>)}
      </select>

      <label htmlFor="cita-medico">Médico</label>
      <select id="cita-medico" name="medico" value={form.medico} onChange={handleChange} required>
        <option value="">— Seleccione —</option>
        {medicos.map((m) => (
          <option key={m.id} value={m.id}>{m.nombres} · {m.especialidad_nombre}</option>
        ))}
      </select>

      <div className="form-cita__fila">
        <div>
          <label htmlFor="cita-fecha">Fecha</label>
          <input id="cita-fecha" type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="cita-hora">Hora</label>
          <input id="cita-hora" type="time" name="hora" value={form.hora} onChange={handleChange} required />
        </div>
      </div>

      <label htmlFor="cita-motivo">Motivo</label>
      <input id="cita-motivo" name="motivo" value={form.motivo} onChange={handleChange} required maxLength={255} />

      {error && <p className="mensaje mensaje--error">{error}</p>}
      {exito && <p className="mensaje mensaje--exito">{exito}</p>}
      <Boton type="submit" texto={enviando ? 'Registrando…' : 'Registrar cita'} disabled={enviando} />
    </form>
  )
}

export default FormularioCita
