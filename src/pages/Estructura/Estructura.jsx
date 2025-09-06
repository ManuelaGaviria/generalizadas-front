import { useEffect, useState } from "react";
import Contenedor from "../../components/Contenedor";
import Button from "../../components/Button";
import ButtonLink from "../../components/ButtonLink";
import Select from "../../components/Select";
import { TbBinaryTree2 } from "react-icons/tb";
import { fetchGet, fetchBody } from "../../utils/fetch";
import Swal from 'sweetalert2';

function Estructura() {
    const [personasSelect, setPersonasSelect] = useState([]);
    const [personaNivel, setPersonaNivel] = useState("");
    const [personaNivelSel, setPersonaNivelSel] = useState("");

    const [nivelInput, setNivelInput] = useState("");

    // Modal de “Nivel”
    const [nivelOpen, setNivelOpen] = useState(false);
    const [nivelData, setNivelData] = useState(null); // {mensaje, nivel?, persona?}

    const [nivelValor, setNivelValor] = useState("");     // input
    const [nivelesOpen, setNivelesOpen] = useState(false);
    const [nivelesData, setNivelesData] = useState(null); // {mensaje, nivel, registros?}

    useEffect(() => {
        (async () => {
            try {
                const r = await fetchGet("/personas");
                if (r?.exito && Array.isArray(r.lista)) {
                    setPersonasSelect(r.lista.map(p => ({ id: p.id, nombre: p.nombre })));
                } else {
                    setPersonasSelect([]);
                }
            } catch {
                setPersonasSelect([]);
            }
        })();
    }, []);

    const deshabilitarSelect = personasSelect.length === 0;

    // ====== ESTADO: Nodo con mayor grado ======
    const [mgOpen, setMgOpen] = useState(false);
    const [mgData, setMgData] = useState(null);

    // ---------- Handlers (los otros se agregan después) ----------
    const mostrarMaxGrado = async () => {
        try {
            const r = await fetchGet("/max-grado");
            // Esperado:
            // { mensaje, grado, nodos:[{nombre, cedula, edad}, ...] }
            setMgData(r);
            setMgOpen(true);
        } catch (e) {
            // 404 u otro error
            setMgData({ mensaje: "No fue posible obtener el nodo con mayor grado." });
            setMgOpen(true);
        }
    };

    // ====== ESTADO: Nodo con mayor nivel ======
    const [mnOpen, setMnOpen] = useState(false);
    const [mnData, setMnData] = useState(null); // {mensaje, nivel, nodos:[...]}

    const mostrarMaxNivel = async () => {
        try {
            // por defecto el back usa modo=edges (raíz = 0). Si quieres raíz=1: /max-nivel?modo=levels
            const r = await fetchGet("/max-nivel");
            // esperado: {mensaje, nivel, nodos:[{nombre, cedula, edad}]}
            setMnData(r);
            setMnOpen(true);
        } catch (e) {
            setMnData({ mensaje: "No fue posible obtener el nodo con mayor nivel." });
            setMnOpen(true);
        }
    };

    // ====== ESTADO: Altura del árbol ======
    const [altOpen, setAltOpen] = useState(false);
    const [altData, setAltData] = useState(null); // {mensaje, modo, altura}

    const mostrarAltura = async (modo = "edges") => {
        try {
            const r = await fetchGet(`/altura?modo=${modo}`);
            // r esperado: { altura, mensaje, modo }
            setAltData(r);
            setAltOpen(true);
        } catch (e) {
            setAltData({ mensaje: "No fue posible obtener la altura.", modo, altura: null });
            setAltOpen(true);
        }
    };

    const onChangePersonaNivel = (e) => setPersonaNivelSel(e.target.value);

    // Normaliza el value del <Select> a cédula (soporta value=cedula o value=nombre)
    const toCedula = (value) => {
        const n = Number(value);
        if (!Number.isNaN(n) && n > 0) return n;
        const f = personasSelect.find(o => o.nombre === value);
        return f?.id ?? null;
    };

    const verNivel = async () => {
        const ced = toCedula(personaNivelSel);
        if (!ced) return Swal.fire({ icon: "warning", title: "Selecciona una persona" });

        try {
            const r = await fetchGet(`/nivel/${ced}`);
            // r: { mensaje, nivel, persona:{nombre,cedula,edad} }
            setNivelData(r);
            setNivelOpen(true);
        } catch (e) {
            // Si tu fetchGet lanza en 404
            setNivelData({ mensaje: "No se encontró la cédula seleccionada en el árbol." });
            setNivelOpen(true);
        }
    };

    const onChangeNivel = (e) => setNivelValor(e.target.value);

    const verRegistrosNivel = async () => {
        const n = Number(nivelValor);
        if (!Number.isInteger(n) || n < 1) {
            return Swal.fire({ icon: "warning", title: "Nivel inválido", text: "Debe ser un entero ≥ 1." });
        }

        try {
            const r = await fetchGet(`/registros-nivel/${n}`);
            // r: { mensaje, nivel, registros:[{nombre,cedula,edad}] }
            setNivelesData(r);
            setNivelesOpen(true);
        } catch (e) {
            // Si fetchGet lanza en 404 o 400
            setNivelesData({
                mensaje: "No hay registros para el nivel solicitado o el nivel es inválido.",
                nivel: n,
                registros: []
            });
            setNivelesOpen(true);
        }
    };


    return (
        <div className="principal-container">
            <Contenedor animate={true}>
                <div className="flex">
                    <TbBinaryTree2 className="icon-pet" />
                    <h1 className="titulo">Consultas sobre la estructura del árbol</h1>
                    <TbBinaryTree2 className="icon-pet" />
                </div>

                {/* Nodo con mayor grado */}
                <div className="displayflex" >
                    <div className="columnaIzquierda"><b>Nodo con mayor grado</b></div>
                    <div className="columnaDerecha">
                        <Button clase="ButtonArbol" eventoClick={mostrarMaxGrado}>Mostrar</Button>
                    </div>
                </div>

                {/* Nodo con mayor nivel */}
                <div className="displayflex" >
                    <div className="columnaIzquierda"><b>Nodo con mayor nivel</b></div>
                    <p>raiz = 0</p>
                    <div className="columnaDerecha">
                        <Button clase="ButtonArbol" eventoClick={mostrarMaxNivel}>Mostrar</Button>
                    </div>
                </div>

                {/* Altura del árbol */}
                <div className="displayflex" >
                    <div className="columnaIzquierda"><b>Altura del árbol</b></div>
                    <p>raiz = 1</p>
                    <div className="columnaDerecha">
                        <Button clase="ButtonArbol" eventoClick={() => mostrarAltura("levels")}>Ver</Button>
                    </div>
                </div>

                {/* Nivel de (con select de personas) */}
                <div className="displayflex">
                    <b><Select
                        titulo="Nivel de"
                        opciones={personasSelect}
                        eventoCambio={onChangePersonaNivel}
                        value={personaNivelSel}
                        disabled={personasSelect.length === 0}
                    /></b>
                    <Button clase="ButtonArbol" eventoClick={verNivel} disabled={personasSelect.length === 0}>
                        ver
                    </Button>
                </div>


                {/* Registros de nivel (input numérico) */}
                <div className="displayflex">
                    <div className="malla" style={{ alignItems: "center", gap: 8 }}>
                        <div className="columnaIzquierda">
                            <label className="label">Registros de nivel</label>
                        </div>
                        <div className="columnaDerecha">
                            <input
                                className="input"
                                type="number"
                                min={1}
                                value={nivelValor}
                                onChange={onChangeNivel}
                                placeholder="Nivel (≥ 1)"
                                style={{ width: 180 }}
                            />
                        </div>
                    </div>

                    <Button
                        clase="ButtonArbol"
                        eventoClick={verRegistrosNivel}
                        disabled={!nivelValor}
                    >
                        ver
                    </Button>
                </div>


                <ButtonLink destino="/" clase="ButtonNavRegresar">Regresar</ButtonLink>
            </Contenedor>
            {/* ===== Modal: Nodo con mayor grado ===== */}
            {mgOpen && (
                <>
                    <div className="ModalOverlay" onClick={() => setMgOpen(false)} />
                    <div className="ModalRoot">
                        <div className="ModalCard">
                            <h1 className="titulo">Nodo con mayor grado</h1>

                            {/* Mensaje + grado */}
                            <p style={{ marginTop: 8, marginBottom: 16 }}>
                                {mgData?.mensaje ?? "Resultado"}{" "}
                                {typeof mgData?.grado === "number" && (
                                    <strong>— Grado: {mgData.grado}</strong>
                                )}
                            </p>

                            {/* Tabla */}
                            {Array.isArray(mgData?.nodos) && mgData.nodos.length > 0 ? (
                                <div className="CenterTable">
                                    <table className="Table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: 240 }}>Nombre</th>
                                                <th style={{ width: 160 }}>Cédula</th>
                                                <th style={{ width: 120 }}>Edad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mgData.nodos.map((n) => (
                                                <tr key={n.cedula}>
                                                    <td>{n.nombre}</td>
                                                    <td>{n.cedula}</td>
                                                    <td>{n.edad}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p style={{ marginTop: 8 }}>
                                    No se encontraron nodos para mostrar.
                                </p>
                            )}

                            <div className="ModalActions">
                                <Button clase="ButtonNav" eventoClick={() => setMgOpen(false)}>
                                    Cerrar
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {/* ===== Modal: Nodo con mayor nivel ===== */}
            {mnOpen && (
                <>
                    <div className="ModalOverlay" onClick={() => setMnOpen(false)} />
                    <div className="ModalRoot">
                        <div className="ModalCard">
                            <h1 className="titulo">Nodo con mayor nivel</h1>

                            {/* Mensaje + nivel */}
                            <p style={{ marginTop: 8, marginBottom: 16 }}>
                                {mnData?.mensaje ?? "Resultado"}{" "}
                                {typeof mnData?.nivel === "number" && (
                                    <strong>— Nivel: {mnData.nivel}</strong>
                                )}
                            </p>

                            {/* Tabla */}
                            {Array.isArray(mnData?.nodos) && mnData.nodos.length > 0 ? (
                                <div className="CenterTable">
                                    <table className="Table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: 240 }}>Nombre</th>
                                                <th style={{ width: 160 }}>Cédula</th>
                                                <th style={{ width: 120 }}>Edad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mnData.nodos.map((n) => (
                                                <tr key={n.cedula}>
                                                    <td>{n.nombre}</td>
                                                    <td>{n.cedula}</td>
                                                    <td>{n.edad}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p style={{ marginTop: 8 }}>No hay nodos para mostrar.</p>
                            )}

                            <div className="ModalActions">
                                <Button clase="ButtonNav" eventoClick={() => setMnOpen(false)}>
                                    Cerrar
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ===== Modal: Altura del árbol ===== */}
            {altOpen && (
                <>
                    <div className="ModalOverlay" onClick={() => setAltOpen(false)} />
                    <div className="ModalRoot">
                        <div className="ModalCard">
                            <h1 className="titulo">Altura del árbol</h1>

                            <p style={{ marginTop: 8, marginBottom: 12 }}>
                                {altData?.mensaje ?? "Resultado"}
                            </p>

                            <div style={{ display: "flex", gap: 24, justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
                                <div style={{ fontWeight: 600 }}>
                                    Modo: <span style={{ textTransform: "capitalize" }}>{altData?.modo ?? "—"}</span>
                                </div>
                                <div style={{ fontSize: 56, lineHeight: "56px", color: "#72B9A9", fontWeight: 700 }}>
                                    {altData?.altura ?? "—"}
                                </div>
                            </div>

                            <div className="ModalActions">
                                <Button clase="ButtonNav" eventoClick={() => setAltOpen(false)}>Cerrar</Button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ===== Modal: Nivel de la persona ===== */}
            {nivelOpen && (
                <>
                    <div className="ModalOverlay" onClick={() => setNivelOpen(false)} />
                    <div className="ModalRoot">
                        <div className="ModalCard">
                            <h1 className="titulo">Nivel del registro</h1>

                            {nivelData?.mensaje && <p style={{ marginTop: 8, marginBottom: 12 }}>{nivelData.mensaje}</p>}

                            {/* Badge grande con el nivel, si existe */}
                            {typeof nivelData?.nivel === "number" && (
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                                    <div
                                        style={{
                                            minWidth: 120,
                                            height: 120,
                                            borderRadius: "50%",
                                            background: "#72B9A9",
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 56,
                                            fontWeight: 700,
                                            boxShadow: "0 6px 18px rgba(0,0,0,.2)"
                                        }}
                                        title="Nivel (raíz = 1)"
                                    >
                                        {nivelData.nivel}
                                    </div>
                                </div>
                            )}

                            {/* Tabla con la persona */}
                            {nivelData?.persona && (
                                <div className="CenterTable">
                                    <table className="Table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: 200 }}>Nombre</th>
                                                <th style={{ width: 200 }}>Cédula</th>
                                                <th style={{ width: 120 }}>Edad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{nivelData.persona.nombre}</td>
                                                <td>{nivelData.persona.cedula}</td>
                                                <td>{nivelData.persona.edad}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="ModalActions">
                                <Button clase="ButtonNav" eventoClick={() => setNivelOpen(false)}>Cerrar</Button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ===== Modal: Registros por nivel ===== */}
            {nivelesOpen && (
                <>
                    <div className="ModalOverlay" onClick={() => setNivelesOpen(false)} />
                    <div className="ModalRoot">
                        <div className="ModalCard">
                            <h1 className="titulo">Registros por nivel</h1>

                            {/* Mensaje del backend */}
                            {nivelesData?.mensaje && (
                                <p style={{ marginTop: 8, marginBottom: 12 }}>{nivelesData.mensaje}</p>
                            )}

                            {/* Badge del nivel */}
                            {typeof nivelesData?.nivel === "number" && (
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                                    <div
                                        style={{
                                            minWidth: 120,
                                            height: 120,
                                            borderRadius: "50%",
                                            background: "#72B9A9",
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 48,
                                            fontWeight: 700,
                                            boxShadow: "0 6px 18px rgba(0,0,0,.2)"
                                        }}
                                        title="Nivel (raíz = 1)"
                                    >
                                        {nivelesData.nivel}
                                    </div>
                                </div>
                            )}

                            {/* Tabla (si hay registros) */}
                            {Array.isArray(nivelesData?.registros) && nivelesData.registros.length > 0 ? (
                                <div className="CenterTable">
                                    <table className="Table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: 240 }}>Nombre</th>
                                                <th style={{ width: 180 }}>Cédula</th>
                                                <th style={{ width: 120 }}>Edad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {nivelesData.registros.map((p, idx) => (
                                                <tr key={`${p.cedula}-${idx}`}>
                                                    <td>{p.nombre}</td>
                                                    <td>{p.cedula}</td>
                                                    <td>{p.edad}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                // Si no hay registros, muestra un hint sutil
                                <p style={{ textAlign: "center", opacity: 0.8, marginTop: 8 }}>
                                    {nivelesData?.nivel ? `Sin registros en el nivel ${nivelesData.nivel}.` : "Sin resultados."}
                                </p>
                            )}

                            <div className="ModalActions">
                                <Button clase="ButtonNav" eventoClick={() => setNivelesOpen(false)}>Cerrar</Button>
                            </div>
                        </div>
                    </div>
                </>
            )}


            <div class="custom-shape-divider-bottom-1725114074">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill"></path>
                </svg>
            </div>
        </div>
    );
}

export default Estructura;
