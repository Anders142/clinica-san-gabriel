import { createContext, useState } from 'react'

// Contexto compartido: recepcionista activa y fecha de trabajo.
// Lo leen Encabezado y FormularioCita con useContext, sin recibirlo por props.
export const ClinicaContext = createContext(null)

export const RECEPCIONISTAS = ['Rosa Villanueva', 'Daniela Chávez', 'Mónica Reyes']

// Fecha local en formato aaaa-mm-dd (no usar toISOString: devuelve UTC).
export function hoyISO() {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

export function ClinicaProvider({ children }) {
  const [recepcionista, setRecepcionista] = useState(RECEPCIONISTAS[0])
  const [fechaTrabajo, setFechaTrabajo] = useState(hoyISO())

  const valor = { recepcionista, setRecepcionista, fechaTrabajo, setFechaTrabajo }
  return <ClinicaContext.Provider value={valor}>{children}</ClinicaContext.Provider>
}
