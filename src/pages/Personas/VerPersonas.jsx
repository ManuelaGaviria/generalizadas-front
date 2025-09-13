import React, { useContext, useEffect, useState } from 'react'
import FullscreenCard from '../../components/FullScreenCard'
import GeneralContext from '../../Context/GeneralContext';
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import ButtonLink from '../../components/ButtonLink';
import { fetchBody, fetchGet } from '../../utils/fetch';
import LabelInputEdit from '../../components/LabelInputEdit';
import Button from '../../components/Button';
import ContenedorForms from '../../components/ContenedorForms';

function VerPersonas() {
    const { changeNombre, changeCedula, changeEdad } = useContext(GeneralContext)
    const [personas, setPersonas] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [backgroundOpacity] = useState(0.5);

    const [personasSelect, setPersonasSelect] = useState([]);
    const [personaSeleccionada, setPersonaSeleccionada] = useState("");

    useEffect(() => {
        const obtenerPersonas = async () => {
            try {
                const respuesta = await fetchGet('/personas'); // asegúrate del baseURL
                if (respuesta.exito) {
                    const opciones = respuesta.lista.map(p => ({
                        id: p.id,        // cedula
                        nombre: p.nombre
                    }));
                    setPersonasSelect(opciones);
                } else {
                    Swal.fire({ icon: "error", title: "Error", text: respuesta.mensaje ?? "No se pudo listar" });
                }
            } catch {
                Swal.fire({ icon: "error", title: "Error", text: "Error al listar personas" });
            }
        };
        obtenerPersonas();
    }, []);

    const handleChangePer = (e) => {
        setPersonaSeleccionada(e.target.value);
    };

    useEffect(() => {
        listPersonas();
    }, []);

    async function listPersonas() {
        try {
            const respuesta = await fetchGet("/personas")
            if (respuesta.exito) {
                setPersonas(respuesta.lista);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: respuesta.error,
                    customClass: {
                        confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Error al procesar la solicitud para listar los clientes',
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
        }
    }

    const openEditModal = (persona) => {
        setSelectedPersona(persona);
        setEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditModalOpen(false);
    };

    async function handleEdit(id) {
        const personaToEdit = personas.find(persona => persona.id === id);
        if (personaToEdit) {
            openEditModal(personaToEdit);
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Persona no encontrada',
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
        }
    }

    async function handleDelete(id) {
        // Mostrar una alerta de confirmación antes de eliminar a la persona
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro de eliminar esta persona?',
            text: "Esta acción no se puede revertir, su hijo mayor pasará a ocupar su lugar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            customClass: {
                confirmButton: 'btn-color',
                cancelButton: 'btn-color-cancel'
            },
            buttonsStyling: false
        });

        // Verificar si el usuario confirmó la eliminación
        if (confirmacion.isConfirmed) {
            try {
                const respuesta = await fetchBody(`/eliminar/${id}`, 'DELETE');
                if (respuesta.exito) {
                    Swal.fire({
                        icon: "success",
                        title: "Persona eliminada con éxito!",
                        customClass: {
                            confirmButton: 'btn-color'
                        },
                        buttonsStyling: false
                    });
                    await listPersonas();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: respuesta.error,
                        customClass: {
                            confirmButton: 'btn-color'
                        },
                        buttonsStyling: false
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: 'Error al procesar la solicitud para eliminar una persona',
                    customClass: {
                        confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                });
            }
        }
    }

    async function editPersona(id) {
        const cedula = document.getElementById('personaCedula').value;
        const nombre = document.getElementById('personaNombre').value;
        const edad = document.getElementById('personaEdad').value;
        if (cedula === "" || nombre === "" || edad === "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Ningún campo puede estar vacío",
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
        } else {
            const data = {
                cedulaActual: Number(id),
                nombre: nombre,
                cedula: Number(cedula),
                edad: Number(edad)
            }
            const respuesta = await fetchBody("/actualizar", "PUT", data);
            if (respuesta.exito) {
                Swal.fire({
                    icon: "success",
                    title: "Persona editada con éxito!",
                    customClass: {
                        confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                });
                handleCloseModal();
                await listPersonas();
            }
        }
    }
    return (
        <div>
            <h1 className='titulo'>Personas</h1>
            <motion.div
                className='ContainerFull'
                initial={{ opacity: 0, x: 1000 }} // Inicia desde la derecha
                animate={{ opacity: 1, x: 0 }} // Animación hacia la izquierda
                exit={{ opacity: 0, x: -1000 }} // Sale hacia la izquierda
                transition={{ duration: 1 }}>

                <FullscreenCard>
                    <div className='CenterTable'>
                        <table className='Table'>
                            <thead>
                                <tr>
                                    <th style={{ width: '200px' }}>Cedula</th>
                                    <th style={{ width: '200px' }}>Nombre</th>
                                    <th style={{ width: '200px' }}>Edad</th>
                                    <th style={{ width: '200px' }}>Cedula Padre</th>
                                    <th style={{ width: '200px' }}>Nombre Padre</th>
                                    <th style={{ width: '200px' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {personas.map((persona) => (
                                    <tr key={persona.id}>
                                        <td>{persona.cedula}</td>
                                        <td>{persona.nombre}</td>
                                        <td>{persona.edad}</td>
                                        <td>{persona.cedulaPadre}</td>
                                        <td>{persona.nombrePadre}</td>
                                        <td className='Actions'>
                                            <button className='btn-edit' onClick={() => handleEdit(persona.id)}><MdModeEdit /></button>
                                            <button className='btn-delete' onClick={() => handleDelete(persona.id)}><MdDelete /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <ButtonLink destino="/personas" clase="ButtonNavRegresar">Regresar</ButtonLink>
                    <ButtonLink destino="/verArbol" clase="ButtonNav">Ver Árbol</ButtonLink>
                    <div class="custom-shape-divider-bottom-1725114074">
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill"></path>
                            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill"></path>
                            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill"></path>
                        </svg>
                    </div>
                </FullscreenCard>
                {editModalOpen && (
                    <>
                        <div
                            className="BackgroundOverlay"
                            style={{ opacity: backgroundOpacity }}
                        />
                        <ContenedorForms>
                            <h1 className='titulo'>Editar Persona</h1>
                            <div className="InputContainer">
                                <LabelInputEdit id="personaCedula" texto="Cedula" eventoCambio={changeCedula} valorInicial={selectedPersona.cedula}></LabelInputEdit>
                                <LabelInputEdit id="personaNombre" texto="Nombre" eventoCambio={changeNombre} valorInicial={selectedPersona.nombre}></LabelInputEdit>
                                <LabelInputEdit id="personaEdad" texto="Edad" eventoCambio={changeEdad} valorInicial={selectedPersona.edad}></LabelInputEdit>
                            </div>
                            <br />
                            <Button clase="ButtonNavEdit" eventoClick={() => editPersona(selectedPersona.id)}>Editar</Button>
                            <Button clase="ButtonNav" eventoClick={handleCloseModal}>Regresar</Button>
                        </ContenedorForms>
                    </>
                )}
            </motion.div>
        </div>

    )
}

export default VerPersonas