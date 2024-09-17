import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Para hacer solicitudes HTTP
import { FaSearch } from "react-icons/fa";
import NuevoExperimentoModal from '../components/NuevoExperimentoModal.jsx';  // Importamos el componente modal

const Experimentos = () => {

    const [experimentos, setExperimentos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);  // Estado para controlar si el modal está abierto

    const [nuevoExperimento, setNuevoExperimento] = useState({
        titulo: '',
        objetivo: '',
        descripcion: '',
        ubicacion: '',
        concentrador: '',
        sensores: []
      });
    const [ubicaciones, setUbicaciones] = useState([]);
    const [concentradores, setConcentradores] = useState([]);
    const [sensores, setSensores] = useState([]);
    const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState('');
    const [concentradorSeleccionado, setConcentradorSeleccionado] = useState('');


    // Obtener experimentos desde la API
    useEffect(() => {
        axios.get('/api/experimentos/all')
            .then((response) => {
                setExperimentos(response.data);
            })
            .catch((error) => {
                console.error("Hubo un error al obtener los experimentos", error);
            });
        
        // Obtener ubicaciones, concentradores, y sensores
        axios.get('/api/ubicaciones').then((response) => setUbicaciones(response.data));
        axios.get('/api/concentradores').then((response) => setConcentradores(response.data));
    }, []);

    useEffect(() => {
        if (concentradorSeleccionado) {
          fetch(`/api/sensores/${concentradorSeleccionado}`)
            .then(response => response.json())
            .then(data => setSensores(data));
        }
      }, [concentradorSeleccionado]);

    // Función para manejar el filtro de búsqueda
    const handleSearchChange = (e) => {
        setFiltro(e.target.value);
    };

    const handleNuevoExperimento = (e) => {
        setNuevoExperimento({ ...nuevoExperimento, [e.target.name]: e.target.value });
    };
    
    const handleCrearExperimento = async (event) => {
        event.preventDefault();
        // Lógica para crear un experimento
        try {
          const response = await fetch('/api/experimentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoExperimento),
          });
          if (response.ok) {
            console.log('Experimento creado con éxito');
            setIsModalOpen(false);  // Cerrar el modal al finalizar
          }
        } catch (error) {
          console.error('Error al crear experimento:', error);
        }
    };

    // Filtrar experimentos según el texto de búsqueda
    const experimentosFiltrados = experimentos.filter((exp) => 
        exp.título.toLowerCase().includes(filtro.toLowerCase())
    );


    return (
        <div className="experimentos-container">
            {/* Botón "Nuevo experimento" */}
            <div className="header">
        <button className="nuevo-experimento-btn" onClick={() => setIsModalOpen(true)}>Nuevo experimento</button>
      </div>
            
            {/* Buscador con ícono de lupa */}
            <div className="search-container">
                <i className="fa fa-search search-icon"></i> {<FaSearch />}
                <input
                    type="text"
                    placeholder="Buscar experimento"
                    value={filtro}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                
            </div>

            {/* Mostrar experimentos */}
            <div className="experimentos-list">
                {experimentosFiltrados.map((exp) => (
                    <div key={exp._id} className="experimento-item">
                        <h3>{exp.título}</h3>
                        <p><strong>Descripción:</strong> {exp.descripción}</p>
                        <p><strong>Objetivos:</strong> {exp.objetivos}</p>
                        <p><strong>Fecha de inicio:</strong> {new Date(exp.fecha_inicio).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
      
            {isModalOpen && (
                <NuevoExperimentoModal
                    nuevoExperimento={nuevoExperimento}
                    handleNuevoExperimento={handleNuevoExperimento}
                    ubicaciones={ubicaciones}
                    concentradores={concentradores}
                    sensores={sensores}
                    ubicacionSeleccionada={ubicacionSeleccionada}
                    setUbicacionSeleccionada={setUbicacionSeleccionada}
                    concentradorSeleccionado={concentradorSeleccionado}
                    setConcentradorSeleccionado={setConcentradorSeleccionado}
                    handleCrearExperimento={handleCrearExperimento}
                    closeModal={() => setIsModalOpen(false)}  // Función para cerrar el modal
                />
            )}

        </div>
       
    );
};

export default Experimentos;