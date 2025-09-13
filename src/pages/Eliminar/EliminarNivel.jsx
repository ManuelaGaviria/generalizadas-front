import { useEffect, useRef, useState } from "react";
import FullscreenCard from "../../components/FullScreenCard";
import Button from "../../components/Button";
import ButtonLink from "../../components/ButtonLink";
import Swal from "sweetalert2";
import { fetchBody, fetchGet } from "../../utils/fetch";
import Tree from "react-d3-tree";

function EliminarNivel() {
  const [nivel, setNivel] = useState("");
  const [treeData, setTreeData] = useState(null);
  const [cargando, setCargando] = useState(false);

  // contenedor para que react-d3-tree tenga tamaño
  const treeRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 500 });

  const updateSize = () => {
    const w = treeRef.current?.offsetWidth ?? 800;
    const h = treeRef.current?.offsetHeight ?? 500;
    setSize({ w, h });
  };

  // Normaliza el JSON del back para react-d3-tree
  function toD3(n) {
    if (!n) return null;
    return {
      name: n.nombre,                             // lo que mostramos
      attributes: { Cedula: n.cedula, Edad: n.edad },
      children: (n.hijos || []).map(toD3),        // <-- hijos → children
    };
  }

  const renderNode = ({ nodeDatum, toggleNode }) => (
    <g>
      <circle r={10} onClick={toggleNode} />
      {/* Nombre a la derecha de la bolita */}
      <text x={14} y={4} style={{ fontSize: 14, fill: '#2f6f66' }}>
        {nodeDatum.name}
      </text>
      {/* Línea secundaria opcional con datos */}
      {nodeDatum.attributes && (
        <text x={14} y={20} style={{ fontSize: 11, fill: '#6b6b6b' }}>
          {`[ced=${nodeDatum.attributes.Cedula}, edad=${nodeDatum.attributes.Edad}]`}
        </text>
      )}
    </g>
  );


  const cargarArbol = async () => {
    try {
      const raw = await fetchGet("/imprimir-json"); // tu endpoint
      setTreeData(toD3(raw));
    } catch {
      setTreeData(null);
    }
  };

  useEffect(() => {
    cargarArbol();
  }, []);

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const onChangeNivel = (e) => setNivel(e.target.value);

  const eliminarNivel = async () => {
    const n = Number(nivel);
    if (!Number.isInteger(n) || n < 1) {
      return Swal.fire({
        icon: "warning",
        title: "Nivel inválido",
        text: "Debe ser un entero ≥ 1.",
      });
    }

    const confirm = await Swal.fire({
      title: `¿Eliminar todos los nodos del nivel ${n}?`,
      text: "Los padres de ese nivel se reemplazarán por su hijo de mayor edad (si aplica).",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn-color",
        cancelButton: "btn-color-cancel",
      },
      buttonsStyling: false,
    });
    if (!confirm.isConfirmed) return;

    try {
      setCargando(true);
      const resp = await fetchBody(`/eliminar-nivel/${n}`, "DELETE");

      if (resp.status === "OK") {
        await Swal.fire({
          icon: "success",
          title: "Nivel eliminado",
          html: `<div style="text-align:left">
                   <b>Nivel:</b> ${resp.nivel}<br/>
                   <b>Eliminados:</b> ${resp.eliminados}<br/>
                   <b>Promovidos:</b> ${resp.promovidos}
                 </div>`,
          customClass: { confirmButton: "btn-color" },
          buttonsStyling: false,
        });
      } else if (resp.status === "NO_CHANGES") {
        await Swal.fire({
          icon: "info",
          title: "Sin cambios",
          text: "No se encontraron registros en ese nivel.",
          customClass: { confirmButton: "btn-color" },
          buttonsStyling: false,
        });
      } else if (resp.status === "BAD_LEVEL") {
        await Swal.fire({
          icon: "error",
          title: "Nivel inválido",
          text: "El nivel debe ser ≥ 1.",
          customClass: { confirmButton: "btn-color" },
          buttonsStyling: false,
        });
      } else if (resp.status === "EMPTY") {
        await Swal.fire({
          icon: "info",
          title: "Árbol vacío",
          customClass: { confirmButton: "btn-color" },
          buttonsStyling: false,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "No se pudo eliminar",
          text: resp.mensaje ?? "Intenta nuevamente.",
          customClass: { confirmButton: "btn-color" },
          buttonsStyling: false,
        });
      }

      await cargarArbol(); // refresca el gráfico
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No fue posible eliminar el nivel.",
        customClass: { confirmButton: "btn-color" },
        buttonsStyling: false,
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h1 className="titulo">Eliminación de niveles</h1>

      <div className="ContainerFull">
        <FullscreenCard>
          {/* Fila: input + botón */}
          <div className="displayflex" style={{ marginBottom: 16 }}>
            <div className="malla" style={{ alignItems: "center", gap: 8 }}>
              <div className="columnaIzquierda">
                <label className="label">Nivel a eliminar</label>
              </div>
              <div className="columnaDerecha">
                <input
                  className="input"
                  type="number"
                  min={1}
                  value={nivel}
                  onChange={onChangeNivel}
                  placeholder="Nivel (≥ 1)"
                  style={{ width: 180 }}
                />
              </div>
            </div>

            <Button
              clase="ButtonNavRegresar"
              eventoClick={eliminarNivel}
              disabled={!nivel || cargando}
            >
              {cargando ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>

          {/* Contenedor del árbol */}
          <div ref={treeRef} className="TreeWrapper">
            {treeData ? (
              <Tree
                data={treeData}                               
                translate={{ x: (size.w ?? 800) / 2, y: 60 }}
                dimensions={{ width: size.w, height: size.h }}
                orientation="vertical"
                separation={{ siblings: 1, nonSiblings: 1.5 }}
                pathFunc="elbow"
                renderCustomNodeElement={renderNode}          
              />
            ) : (
              <div style={{ textAlign: "center", paddingTop: 24 }}>
                <em>Árbol vacío o no disponible.</em>
              </div>
            )}
          </div>

          <ButtonLink destino="/" clase="ButtonNavRegresar">
            Regresar
          </ButtonLink>
        </FullscreenCard>
      </div>
    </div>
  );
}

export default EliminarNivel;