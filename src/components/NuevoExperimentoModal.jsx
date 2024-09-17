// NuevoExperimentoModal.jsx
import React, { useState } from 'react';

const NuevoExperimentoModal = ({
  nuevoExperimento,
  handleNuevoExperimento,
  ubicaciones,
  concentradores,
  sensores,
  ubicacionSeleccionada,
  setUbicacionSeleccionada,
  concentradorSeleccionado,
  setConcentradorSeleccionado,
  handleCrearExperimento,
  closeModal
}) => {

  // Estado para manejar los errores de validación
  const [errores, setErrores] = useState({});

  // Función para validar los campos del formulario
  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!nuevoExperimento.titulo.trim()) {
      nuevosErrores.titulo = 'El título es obligatorio';
    }
    if (!nuevoExperimento.objetivo.trim()) {
      nuevosErrores.objetivo = 'El objetivo es obligatorio';
    }
    if (!nuevoExperimento.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria';
    }
    if (!nuevoExperimento.ubicacion) {
      nuevosErrores.ubicacion = 'Debe seleccionar una ubicación';
    }
    if (!nuevoExperimento.concentrador) {
      nuevosErrores.concentrador = 'Debe seleccionar un concentrador';
    }
    if (nuevoExperimento.sensores.length === 0) {
      nuevosErrores.sensores = 'Debe seleccionar al menos un sensor';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;  // Si no hay errores, el formulario es válido
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validarFormulario()) {
      handleCrearExperimento(event);  // Solo enviar si la validación es correcta
    }
  };


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Crear experimento</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Título:
            <input
              type="text"
              name="titulo"
              value={nuevoExperimento.titulo}
              onChange={handleNuevoExperimento}
              placeholder="Nombre del experimento"
            />
            {errores.titulo && <p className="error">{errores.titulo}</p>} {/* Mostrar error si existe */}
          </label>
          <label>
            Objetivo:
            <input
              type="text"
              name="objetivo"
              value={nuevoExperimento.objetivo}
              onChange={handleNuevoExperimento}
              placeholder="Objetivo"
            />
            {errores.objetivo && <p className="error">{errores.objetivo}</p>}
          </label>
          <label>
            Descripción:
            <textarea
              name="descripcion"
              value={nuevoExperimento.descripcion}
              onChange={handleNuevoExperimento}
              placeholder="Descripción"
            />
            {errores.descripcion && <p className="error">{errores.descripcion}</p>}
          </label>
          <label>
            Ubicación:
            <select
              name="ubicacion"
              value={nuevoExperimento.ubicacion}
              onChange={(e) => {
                handleNuevoExperimento(e);
                setUbicacionSeleccionada(e.target.value);
              }}
            >
              <option value="">Seleccione una ubicación</option>
              {ubicaciones.map((ubicacion) => (
                <option key={ubicacion._id} value={ubicacion._id}>
                  {ubicacion.área} - {ubicacion.recinto}
                </option>
              ))}
            </select>
            {errores.ubicacion && <p className="error">{errores.ubicacion}</p>}
          </label>
          <label>
            Concentrador:
            <select
              name="concentrador"
              value={nuevoExperimento.concentrador}
              onChange={(e) => {
                handleNuevoExperimento(e);
                setConcentradorSeleccionado(e.target.value);
              }}
            >
              <option value="">Seleccione un concentrador</option>
              {concentradores
                .filter((concentrador) => concentrador.ubicación === ubicacionSeleccionada)
                .map((concentrador) => (
                  <option key={concentrador._id} value={concentrador._id}>
                    {concentrador.placa}
                  </option>
                ))}
            </select>
            {errores.concentrador && <p className="error">{errores.concentrador}</p>}
          </label>
          <label>
            Sensores:
            <select
              multiple
              name="sensores"
              value={nuevoExperimento.sensores}
              onChange={(e) => {
                const sensoresSeleccionados = Array.from(e.target.selectedOptions, (option) => option.value);
                handleNuevoExperimento({ target: { name: 'sensores', value: sensoresSeleccionados } });
              }}
            >
              {sensores.map((sensor) => (
                <option key={sensor._id} value={sensor.tipo}>
                  {sensor.tipo}
                </option>
              ))}
            </select>
            {errores.sensores && <p className="error">{errores.sensores}</p>}
          </label>
          <div className="Buton">
            <button type="submit">Crear experimento</button>
            <button type="button" onClick={closeModal}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoExperimentoModal;
