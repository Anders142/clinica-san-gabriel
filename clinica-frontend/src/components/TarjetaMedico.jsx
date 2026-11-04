import './TarjetaMedico.css'

const FOTO_POR_DEFECTO = '/medico-default.svg'

function TarjetaMedico({ nombres, cmp, especialidad, foto }) {
  return (
    <article className="tarjeta-medico">
      <img
        className="tarjeta-medico__foto"
        src={foto || FOTO_POR_DEFECTO}
        alt={`Foto de ${nombres}`}
      />
      <h3>{nombres}</h3>
      <p className="tarjeta-medico__esp">{especialidad}</p>
      <p className="tarjeta-medico__cmp">CMP {cmp}</p>
    </article>
  )
}

export default TarjetaMedico
