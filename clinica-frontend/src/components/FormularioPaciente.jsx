import { useState } from 'react'
import { crearPaciente, erroresPorCampo, mensajeDeError } from '../services/api.js'
import Boton from './Boton.jsx'
import './FormularioPaciente.css'

const VACIO = { dni: '', nombres: '', fecha_nacimiento: '', telefono: '', correo: '' }

function validar(datos) {
  const errores = {}
  if (!datos.dni.trim()) errores.dni = 'El DNI es obligatorio.'
  else if (!/^\d{8}$/.test(datos.dni)) errores.dni = 'El DNI debe tener exactamente 8 dígitos.'
  if (!datos.nombres.trim()) errores.nombres = 'Los nombres son obligatorios.'
  if (!datos.fecha_nacimiento) errores.fecha_nacimiento = 'La fecha de nacimiento es obligatoria.'
  if (datos.telefono && !/^\d{9}$/.test(datos.telefono))
    errores.telefono = 'El teléfono debe tener 9 dígitos.'
  if (!datos.correo.trim()) errores.correo = 'El correo es obligatorio.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) errores.correo = 'Ingrese un correo válido.'
  return errores
}

function FormularioPaciente({ onPacienteCreado }) {
  // Formulario controlado: el estado es la única fuente de verdad de los campos.
  const [datos, setDatos] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [exito, setExito] = useState('')
  const [errorServidor, setErrorServidor] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Un único manejador para todos los campos: usa el atributo name del input.
  function handleChange(event) {
    setDatos({ ...datos, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault() // evita que el navegador recargue la página
    setExito('')
    setErrorServidor('')
    const erroresCliente = validar(datos)
    setErrores(erroresCliente)
    if (Object.keys(erroresCliente).length > 0) return

    setEnviando(true)
    try {
      const nuevo = await crearPaciente(datos) // POST /api/pacientes/
      setExito(`Paciente ${nuevo.nombres} registrado correctamente.`)
      setDatos(VACIO)
      onPacienteCreado?.(nuevo)
    } catch (err) {
      const deCampos = erroresPorCampo(err)
      if (err.status === 400 && Object.keys(deCampos).length) setErrores(deCampos)
      else setErrorServidor(mensajeDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  const campo = (name, etiqueta, tipo = 'text', extra = {}) => (
    <div className="form-paciente__campo">
      <label htmlFor={`pac-${name}`}>{etiqueta}</label>
      <input
        id={`pac-${name}`} name={name} type={tipo}
        value={datos[name]} onChange={handleChange}
        aria-invalid={Boolean(errores[name])} {...extra}
      />
      {errores[name] && <span className="form-paciente__error">{errores[name]}</span>}
    </div>
  )

  return (
    <form className="form-paciente" onSubmit={handleSubmit} noValidate>
      <h2>Registrar paciente</h2>
      {campo('dni', 'DNI', 'text', { maxLength: 8, inputMode: 'numeric' })}
      {campo('nombres', 'Nombres')}
      {campo('fecha_nacimiento', 'Fecha de nacimiento', 'date')}
      {campo('telefono', 'Teléfono (opcional)', 'tel', { maxLength: 9 })}
      {campo('correo', 'Correo', 'email')}
      {exito && <p className="mensaje mensaje--exito">{exito}</p>}
      {errorServidor && <p className="mensaje mensaje--error">{errorServidor}</p>}
      <Boton type="submit" texto={enviando ? 'Guardando…' : 'Registrar'} disabled={enviando} />
    </form>
  )
}

export default FormularioPaciente
