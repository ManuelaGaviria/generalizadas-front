import Contenedor from '../../components/Contenedor'
import { FaUserAlt } from "react-icons/fa";
import Button from '../../components/Button';
import LabelInput from '../../components/LabelInput';
import { useContext, useEffect, useState } from 'react';
import GeneralContext from '../../Context/GeneralContext';
import Swal from 'sweetalert2';
import { fetchBody, fetchGet } from '../../utils/fetch';
import { useNavigate } from 'react-router-dom';
import ButtonLink from '../../components/ButtonLink';
import Select from '../../components/Select';

function CrearPersonas() {
    const { nombre, cedula, edad, changeNombre, changeCedula, changeEdad } = useContext(GeneralContext);
    const navigate = useNavigate();

    const [personasSelect, setPersonasSelect] = useState([]);
    const [personaSeleccionada, setPersonaSeleccionada] = useState(""); // cédula del padre (string)

    useEffect(() => {
        const obtenerPersonas = async () => {
            try {
                const r = await fetchGet('/personas');

                if (r?.exito && Array.isArray(r.lista)) {
                    const opciones = r.lista.map(p => ({
                        id: p.id,     
                        nombre: p.nombre
                    }));
                    setPersonasSelect(opciones);
                } else {
                    setPersonasSelect([]); 
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

    async function handleCrearPersona() {
        if (!nombre || !cedula || !edad) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Por favor llena todos los campos.",
                customClass: { confirmButton: 'btn-color' },
                buttonsStyling: false
            });
            return;
        }

        const payload = {
            // Si no eliges padre, se envía null para intentar crear la raíz
            cedulaPadre: personaSeleccionada ? Number(personaSeleccionada) : null,
            nombre,
            cedula: Number(cedula),
            edad: Number(edad),
        };

        const respuesta = await fetchBody('/insertar', 'POST', payload); // o '/arbol/insertar' según tu baseURL
        if (respuesta.exito) {
            Swal.fire({
                icon: "success",
                title: "Persona creada con éxito!",
                customClass: { confirmButton: 'btn-color' },
                buttonsStyling: false
            });
            navigate("/verArbol");
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: respuesta.mensaje ?? "No se pudo crear la persona."
            });
        }
    }

    const botonDeshabilitado = !nombre || !cedula || !edad; // opcional

    return (
        <div>
            <div className='principal-container'>
                <Contenedor animate={true}>
                    <div className='flex'>
                        <FaUserAlt className='icon-pet' />
                        <h1 className='titulo'>Personas</h1>
                        <FaUserAlt className='icon-pet' />
                    </div>
                    <div>
                        <LabelInput texto="Nombre" eventoCambio={changeNombre} />
                        <LabelInput texto="Cédula" tipo="number" eventoCambio={changeCedula} />
                        <LabelInput texto="Edad" tipo="number" eventoCambio={changeEdad} />

                        {/* Selección de padre (opcional). value controlado. */}
                        <Select
                            titulo="Seleccionar padre (opcional)"
                            opciones={personasSelect}
                            eventoCambio={handleChangePer}
                            value={personaSeleccionada}
                            disabled={personasSelect.length === 0} // si no hay personas aún
                        />

                        <Button clase="ButtonNav" eventoClick={handleCrearPersona} disabled={botonDeshabilitado}>
                            Crear
                        </Button>
                        <ButtonLink destino="/personas" clase="ButtonNavRegresar">Regresar</ButtonLink>
                    </div>
                </Contenedor>
            </div>

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

export default CrearPersonas;
