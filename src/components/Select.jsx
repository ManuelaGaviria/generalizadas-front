// components/Select.jsx
function Select({ titulo, opciones, eventoCambio, value, disabled }) {
  return (
    <div className="malla">
      <div className="columnaIzquierda">
        <label className="label">{titulo}</label>
      </div>
      <div className="columnaDerecha">
        <select
          className="select"
          onChange={eventoCambio}
          value={value ?? ""}          // <- controlado
          disabled={!!disabled}        // <- soporta disabled
        >
          <option value="">Seleccione uno</option>
          {opciones.map((item) => (
            <option value={item.id} key={item.id}>
              {item.id + " - " +item.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

const vacio = () => {};

Select.defaultProps = {
  titulo: "example",
  opciones: [],
  value: "",
  disabled: false,
  eventoCambio: vacio,
};

export default Select;
