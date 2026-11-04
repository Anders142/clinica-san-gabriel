import './ResumenCitas.css'

// Todo se calcula a partir de las props: no tiene estado propio,
// por eso se actualiza solo cuando el padre cambia las citas.
function ResumenCitas({ citas, estados }) {
  const totales = citas.reduce((acc, c) => {
    acc[c.estado_nombre] = (acc[c.estado_nombre] || 0) + 1
    return acc
  }, {})

  return (
    <section className="resumen">
      <h2>Resumen</h2>
      <div className="resumen__grid">
        <div className="resumen__total"><span>{citas.length}</span>Total</div>
        {estados.map((e) => (
          <div key={e.id} className={`resumen__item estado--${e.nombre}`}>
            <span>{totales[e.nombre] || 0}</span>{e.nombre}
          </div>
        ))}
      </div>
    </section>
  )
}

export default ResumenCitas
