import { useEffect, useState } from "react";
import Contenedor from "../../components/Contenedor";
import Button from "../../components/Button";
import ButtonLink from "../../components/ButtonLink";
import Select from "../../components/Select";
import ContenedorForms from "../../components/ContenedorForms";
import Swal from "sweetalert2";
import { fetchGet } from "../../utils/fetch";
import { FaUserAlt } from "react-icons/fa";
import { TbCirclesRelation } from "react-icons/tb";

function ConsultaRelaciones() {
    const [personasSelect, setPersonasSelect] = useState([]);
    const [personaSeleccionada, setPersonaSeleccionada] = useState(""); // valor del <select>
    const [modalOpen, setModalOpen] = useState(false);
    const [resultado, setResultado] = useState(null); // {mensaje, padre?}

    const openModal = (persona) => {
        setResultado(persona);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    // Cargar personas para el select
    useEffect(() => {
        (async () => {
            try {
                const r = await fetchGet("/personas");
                if (r?.exito && Array.isArray(r.lista)) {
                    const opciones = r.lista.map(p => ({
                        id: p.id,        // cédula
                        nombre: p.nombre // label
                    }));
                    setPersonasSelect(opciones);
                } else {
                    setPersonasSelect([]);
                }
            } catch {
                Swal.fire({ icon: "error", title: "Error", text: "Error al listar personas" });
            }
        })();
    }, []);

    const onChangePersona = (e) => setPersonaSeleccionada(e.target.value);

    // Normaliza lo que venga del Select para obtener la cédula (tu Select a veces usa value=nombre)
    const valorAcedula = (value) => {
        const n = Number(value);
        if (!Number.isNaN(n) && n > 0) return n;
        const encontrado = personasSelect.find(o => o.nombre === value);
        return encontrado ? encontrado.id : null;
    };

    const verPadre = async () => {
        const ced = valorAcedula(personaSeleccionada);
        if (!ced) {
            Swal.fire({ icon: "warning", title: "Selecciona una persona" });
            return;
        }
        console.log(ced)
        try {
            const r = await fetchGet(`/padre/${ced}`);
            setResultado(r);
            setModalOpen(true);
        } catch (e) {
            setResultado({ mensaje: "No se encontró la cédula seleccionada." });
            setModalOpen(true);
        }
    };

    const cerrar = () => setModalOpen(false);

    const botonDeshabilitado = personasSelect.length === 0;

    // --- HIJOS ---
    const [personaSeleccionadaHijos, setPersonaSeleccionadaHijos] = useState("");
    const [modalOpenHijos, setModalOpenHijos] = useState(false);
    const [resultadoHijos, setResultadoHijos] = useState(null); // {mensaje, hijos: []}

    const onChangePersonaHijos = (e) => setPersonaSeleccionadaHijos(e.target.value);

    const verHijos = async () => {
        const valorAcedula = (value) => {
            const n = Number(value);
            if (!Number.isNaN(n) && n > 0) return n;
            const encontrado = personasSelect.find(o => o.nombre === value);
            return encontrado ? encontrado.id : null;
        };

        const ced = valorAcedula(personaSeleccionadaHijos);
        if (!ced) {
            Swal.fire({ icon: "warning", title: "Selecciona una persona" });
            return;
        }

        try {
            const r = await fetchGet(`/hijos/${ced}`);
            // Backend: {mensaje, hijos: []} o 404
            setResultadoHijos({
                mensaje: r?.mensaje ?? "Hijos encontrados.",
                hijos: Array.isArray(r?.hijos) ? r.hijos : []
            });
            setModalOpenHijos(true);
        } catch {
            setResultadoHijos({ mensaje: "No se encontró la cédula seleccionada.", hijos: [] });
            setModalOpenHijos(true);
        }
    };

    // --- HERMANOS ---
    const [personaSeleccionadaHermanos, setPersonaSeleccionadaHermanos] = useState("");
    const [modalOpenHermanos, setModalOpenHermanos] = useState(false);
    const [resultadoHermanos, setResultadoHermanos] = useState(null); // {mensaje, hermanos: []}

    const onChangePersonaHermanos = (e) => setPersonaSeleccionadaHermanos(e.target.value);

    const verHermanos = async () => {
        const ced = valorAcedula(personaSeleccionadaHermanos); // reutiliza tu helper
        if (!ced) {
            Swal.fire({ icon: "warning", title: "Selecciona una persona" });
            return;
        }
        try {
            const r = await fetchGet(`/hermanos/${ced}`);
            setResultadoHermanos({
                mensaje: r?.mensaje ?? "Hermanos encontrados.",
                hermanos: Array.isArray(r?.hermanos) ? r.hermanos : []
            });
            setModalOpenHermanos(true);
        } catch {
            setResultadoHermanos({ mensaje: "No se encontró la cédula seleccionada.", hermanos: [] });
            setModalOpenHermanos(true);
        }
    };

    // --- ANCESTROS ---
    const [personaSeleccionadaAnc, setPersonaSeleccionadaAnc] = useState("");
    const [modalOpenAnc, setModalOpenAnc] = useState(false);
    const [resultadoAnc, setResultadoAnc] = useState(null); // {mensaje, ancestros: []}

    const onChangePersonaAnc = (e) => setPersonaSeleccionadaAnc(e.target.value);

    const verAncestros = async () => {
        const ced = valorAcedula(personaSeleccionadaAnc); // reutiliza tu helper
        if (!ced) {
            Swal.fire({ icon: "warning", title: "Selecciona una persona" });
            return;
        }
        try {
            const r = await fetchGet(`/ancestros/${ced}`);
            setResultadoAnc({
                mensaje: r?.mensaje ?? "Ancestros encontrados (padre → ... → raíz).",
                ancestros: Array.isArray(r?.ancestros) ? r.ancestros : []
            });
            setModalOpenAnc(true);
        } catch {
            setResultadoAnc({ mensaje: "No se encontró la cédula seleccionada.", ancestros: [] });
            setModalOpenAnc(true);
        }
    };

    // --- DESCENDIENTES ---
    const [personaSeleccionadaDesc, setPersonaSeleccionadaDesc] = useState("");
    const [modalOpenDesc, setModalOpenDesc] = useState(false);
    const [resultadoDesc, setResultadoDesc] = useState(null); // {mensaje, descendientes: []}

    const onChangePersonaDesc = (e) => setPersonaSeleccionadaDesc(e.target.value);

    const verDescendientes = async () => {
        const ced = valorAcedula(personaSeleccionadaDesc); // reutiliza tu helper
        if (!ced) {
            Swal.fire({ icon: "warning", title: "Selecciona una persona" });
            return;
        }
        try {
            const r = await fetchGet(`/descendientes/${ced}`);
            setResultadoDesc({
                mensaje: r?.mensaje ?? "Descendientes encontrados (preorden).",
                descendientes: Array.isArray(r?.descendientes) ? r.descendientes : []
            });
            setModalOpenDesc(true);
        } catch {
            setResultadoDesc({ mensaje: "No se encontró la cédula seleccionada.", descendientes: [] });
            setModalOpenDesc(true);
        }
    };

    return (
        <div>
            <div className="principal-container">
                <Contenedor animate={true}>
                    <div className="flex">
                        <TbCirclesRelation className="icon-pet" />
                        <h1 className="titulo">Consultas de relaciones familiares</h1>
                        <TbCirclesRelation className="icon-pet" />
                    </div>

                    <div>
                        <div class="displayflex">
                            <Select titulo="Padre" opciones={personasSelect} eventoCambio={onChangePersona} value={personaSeleccionada} disabled={botonDeshabilitado} />
                            <Button clase="ButtonArbol" eventoClick={verPadre} disabled={botonDeshabilitado}> Ver </Button>
                        </div>

                        {/* HIJOS */}
                        <div className="displayflex" >
                            <Select
                                titulo="Hijos de"
                                opciones={personasSelect}
                                eventoCambio={onChangePersonaHijos}
                                value={personaSeleccionadaHijos}
                                disabled={botonDeshabilitado}
                            />
                            <Button clase="ButtonArbol" eventoClick={verHijos} disabled={botonDeshabilitado}>
                                Ver
                            </Button>
                        </div>

                        {/* HERMANOS */}
                        <div className="displayflex" style={{ marginTop: 12 }}>
                            <Select
                                titulo="Hermanos de"
                                opciones={personasSelect}
                                eventoCambio={onChangePersonaHermanos}
                                value={personaSeleccionadaHermanos}
                                disabled={botonDeshabilitado}
                            />
                            <Button clase="ButtonArbol" eventoClick={verHermanos} disabled={botonDeshabilitado}>
                                Ver
                            </Button>
                        </div>

                        {/* ANCESTROS */}
                        <div className="displayflex" style={{ marginTop: 12 }}>
                            <Select
                                titulo="Ancestros de"
                                opciones={personasSelect}
                                eventoCambio={onChangePersonaAnc}
                                value={personaSeleccionadaAnc}
                                disabled={botonDeshabilitado}
                            />
                            <Button clase="ButtonArbol" eventoClick={verAncestros} disabled={botonDeshabilitado}>
                                Ver
                            </Button>
                        </div>

                        {/* DESCENDIENTES */}
                        <div className="displayflex" style={{ marginTop: 12 }}>
                            <Select
                                titulo="Descendientes de"
                                opciones={personasSelect}
                                eventoCambio={onChangePersonaDesc}
                                value={personaSeleccionadaDesc}
                                disabled={botonDeshabilitado}
                            />
                            <Button clase="ButtonArbol" eventoClick={verDescendientes} disabled={botonDeshabilitado}>
                                Ver
                            </Button>
                        </div>

                        <ButtonLink destino="/" clase="ButtonNavRegresar">Regresar</ButtonLink>
                    </div>
                </Contenedor>
            </div>

            {modalOpen && (
                <>
                    <div className="ModalOverlay" onClick={closeModal} />
                    <div className="ModalRoot">
                        <div className="ModalCard">
                            <h1 className="titulo">Padre</h1>

                            {resultado?.mensaje && <p>{resultado.mensaje}</p>}

                            {resultado?.padre && (
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
                                                <td>{resultado.padre.nombre}</td>
                                                <td>{resultado.padre.cedula}</td>
                                                <td>{resultado.padre.edad}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="ModalActions">
                                <Button clase="ButtonNav" eventoClick={closeModal}>Cerrar</Button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {modalOpenHijos && (
                <>
                    <div className="ModalOverlay" onClick={() => setModalOpenHijos(false)} />
                    <div className="ModalRoot">
                        <div className="ModalCard">
                            <h1 className="titulo">Hijos</h1>

                            {resultadoHijos?.mensaje && <p>{resultadoHijos.mensaje}</p>}

                            {Array.isArray(resultadoHijos?.hijos) && resultadoHijos.hijos.length > 0 && (
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
                                            {resultadoHijos.hijos.map(h => (
                                                <tr key={h.cedula}>
                                                    <td>{h.nombre}</td>
                                                    <td>{h.cedula}</td>
                                                    <td>{h.edad}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="ModalActions">
                                <Button clase="ButtonNav" eventoClick={() => setModalOpenHijos(false)}>
                                    Cerrar
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {modalOpenHermanos && (
                <>
                    <div className="ModalOverlay" onClick={() => setModalOpenHermanos(false)} />
                    <div className="ModalRoot">
                        <div className="ModalCard">
                            <h1 className="titulo">Hermanos</h1>

                            {resultadoHermanos?.mensaje && <p>{resultadoHermanos.mensaje}</p>}

                            {Array.isArray(resultadoHermanos?.hermanos) && resultadoHermanos.hermanos.length > 0 && (
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
                                            {resultadoHermanos.hermanos.map(h => (
                                                <tr key={h.cedula}>
                                                    <td>{h.nombre}</td>
                                                    <td>{h.cedula}</td>
                                                    <td>{h.edad}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="ModalActions">
                                <Button clase="ButtonNav" eventoClick={() => setModalOpenHermanos(false)}>Cerrar</Button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {modalOpenAnc && (
                <>
                    <div className="ModalOverlay" onClick={() => setModalOpenAnc(false)} />
                    <div className="ModalRoot">
                        <div className="ModalCard">
                            <h1 className="titulo">Ancestros</h1>

                            {resultadoAnc?.mensaje && <p>{resultadoAnc.mensaje}</p>}

                            {Array.isArray(resultadoAnc?.ancestros) && resultadoAnc.ancestros.length > 0 && (
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
                                            {resultadoAnc.ancestros.map(a => (
                                                <tr key={a.cedula}>
                                                    <td>{a.nombre}</td>
                                                    <td>{a.cedula}</td>
                                                    <td>{a.edad}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="ModalActions">
                                <Button clase="ButtonNav" eventoClick={() => setModalOpenAnc(false)}>Cerrar</Button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {modalOpenDesc && (
                <>
                    <div className="ModalOverlay" onClick={() => setModalOpenDesc(false)} />
                    <div className="ModalRoot">
                        <div className="ModalCard">
                            <h1 className="titulo">Descendientes</h1>

                            {resultadoDesc?.mensaje && <p>{resultadoDesc.mensaje}</p>}

                            {Array.isArray(resultadoDesc?.descendientes) && resultadoDesc.descendientes.length > 0 && (
                                <div className="CenterTable">
                                    <table className="Table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: 80 }}>Nivel</th>
                                                <th style={{ width: 200 }}>Nombre</th>
                                                <th style={{ width: 160 }}>Cédula</th>
                                                <th style={{ width: 100 }}>Edad</th>
                                                <th style={{ width: 160 }}>Padre</th>
                                                <th style={{ width: 140 }}>Cédula padre</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {resultadoDesc.descendientes.map(d => (
                                                <tr key={`${d.cedula}-${d.nivel}`}>
                                                    <td>{d.nivel}</td>
                                                    <td>{d.nombre}</td>
                                                    <td>{d.cedula}</td>
                                                    <td>{d.edad}</td>
                                                    <td>{d.padreNombre ?? ""}</td>
                                                    <td>{d.padreCedula ?? ""}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="ModalActions">
                                <Button clase="ButtonNav" eventoClick={() => setModalOpenDesc(false)}>Cerrar</Button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Curva decorativa como tus otras pantallas */}
            <div className="custom-shape-divider-bottom-1725114074">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
                </svg>
            </div>
        </div>
    );
}

export default ConsultaRelaciones;
