import { useState } from 'react'
import { actualizarCita, mensajeDeError } from '../services/api.js'
import Boton from './Boton.jsx'
import './DetalleCita.css'

function DetalleCita({ cita, estados, onCambiarEstado }) {
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  if (!cita) {
    return (
      <section className="detalle">
        <h2>Detalle de la cita</h2>
        <p className="mensaje mensaje--info">Seleccione una cita con «Ver detalle».</p>
      </section>
    )
  }

  async function cambiarEstado(nombreEstado) {
    const estado = estados.find((e) => e.nombre === nombreEstado)
    if (!estado) return
    setError('')
    setGuardando(true)
    try {
      const actualizada = await actualizarCita(cita.id, { estado: estado.id }) // PATCH
      onCambiarEstado(actualizada) // notifica al padre
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setGuardando(false)
    }
  }

  // Estado final (atendida / cancelada): no se permite seguir cambiando.
  const bloqueada = cita.estado_es_final || guardando

  return (
    <section className="detalle">
      <h2>Detalle de la cita</h2>
      <dl>
        <dt>Paciente</dt><dd>{cita.paciente_nombre}</dd>
        <dt>Médico</dt><dd>{cita.medico_nombre}</dd>
        <dt>Especialidad</dt><dd>{cita.especialidad}</dd>
        <dt>Fecha</dt><dd>{cita.fecha}</dd>
        <dt>Hora</dt><dd>{cita.hora.slice(0, 5)}</dd>
        <dt>Motivo</dt><dd>{cita.motivo}</dd>
        <dt>Estado</dt>
        <dd><span className={`estado estado--${cita.estado_nombre}`}>{cita.estado_nombre}</span></dd>
      </dl>
      {error && <p className="mensaje mensaje--error">{error}</p>}
      {cita.estado_es_final && (
        <p className="mensaje mensaje--info">Estado final: ya no se puede modificar.</p>
      )}
      <div className="detalle__acciones">
        <Boton onClick={() => cambiarEstado('confirmada')} disabled={bloqueada}>Confirmar</Boton>
        <Boton onClick={() => cambiarEstado('atendida')} disabled={bloqueada}>Marcar como atendida</Boton>
        <Boton variante="peligro" onClick={() => cambiarEstado('cancelada')} disabled={bloqueada}>Cancelar</Boton>
      </div>
    </section>
  )
}

export default DetalleCita
