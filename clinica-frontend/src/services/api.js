// Capa de acceso a la API REST de Django (usa fetch).
export const BASE_URL = 'http://localhost:8000/api/'

async function request(ruta, opciones = {}) {
  let respuesta
  try {
    respuesta = await fetch(BASE_URL + ruta, {
      headers: { 'Content-Type': 'application/json' },
      ...opciones,
    })
  } catch {
    const err = new Error('No se pudo conectar con el servidor. ¿Está encendido el backend?')
    err.status = 0
    throw err
  }
  if (respuesta.status === 204) return null // DELETE correcto: sin cuerpo

  let datos = null
  try {
    datos = await respuesta.json()
  } catch {
    /* respuesta sin JSON */
  }
  if (!respuesta.ok) {
    const err = new Error(`Error ${respuesta.status} en la solicitud`)
    err.status = respuesta.status
    err.data = datos
    throw err
  }
  return datos
}

const enviar = (metodo, ruta, cuerpo) =>
  request(ruta, { method: metodo, body: cuerpo ? JSON.stringify(cuerpo) : undefined })

// --- Lecturas ---
export const getEspecialidades = () => request('especialidades/')
export const getMedicos = (especialidadId) =>
  request(especialidadId ? `medicos/?especialidad=${especialidadId}` : 'medicos/')
export const getPacientes = () => request('pacientes/')
export const getCitas = (fecha) => request(fecha ? `citas/?fecha=${fecha}` : 'citas/')
export const getEstados = () => request('estados/')

// --- Escrituras ---
export const crearCita = (datos) => enviar('POST', 'citas/', datos)
export const actualizarCita = (id, parcial) => enviar('PATCH', `citas/${id}/`, parcial)
export const crearPaciente = (datos) => enviar('POST', 'pacientes/', datos)
export const eliminarPaciente = (id) => enviar('DELETE', `pacientes/${id}/`)

// --- Utilidades para mostrar errores del backend ---
// DRF responde por ejemplo { hora: ["El médico ya tiene una cita..."] }
export function erroresPorCampo(err) {
  const resultado = {}
  if (err?.data && typeof err.data === 'object') {
    for (const [campo, valor] of Object.entries(err.data)) {
      resultado[campo] = Array.isArray(valor) ? valor.join(' ') : String(valor)
    }
  }
  return resultado
}

export function mensajeDeError(err) {
  const porCampo = erroresPorCampo(err)
  const mensajes = Object.values(porCampo)
  return mensajes.length ? mensajes.join(' ') : err.message
}
