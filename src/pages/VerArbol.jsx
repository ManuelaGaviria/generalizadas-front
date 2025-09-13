import { useEffect, useRef, useState } from "react";
import FullscreenCard from "../components/FullScreenCard";
import ButtonLink from "../components/ButtonLink";
import { fetchGet } from "../utils/fetch";
import Tree from "react-d3-tree";

function VerArbol() {
  const [treeData, setTreeData] = useState(null);

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
      const raw = await fetchGet("/imprimir-json");
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

  return (
    <div>
      <h1 className="titulo">Ver árbol</h1>

      <div className="ContainerFull">
        <FullscreenCard>
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

export default VerArbol;