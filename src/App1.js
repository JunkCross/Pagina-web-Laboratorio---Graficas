import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { BrowerRouter } from 'react-router-dom';

function App() {







  const [experimentos, setExperimentos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [nuevoExperimento, setNuevoExperimento] = useState({
    titulo: '',
    objetivo: '',
    descripcion: '',
    ubicacion: '',
    concentrador: '',
    sensores: []
  });
  const [ubicaciones, setUbicaciones] = useState([]);
  const [recintos, setRecintos] = useState([]);
  const [concentradores, setConcentradores] = useState([]);
  const [sensores, setSensores] = useState([]);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState('');
  const [concentradorSeleccionado, setConcentradorSeleccionado] = useState('');

  useEffect(() => {
    fetch('/api/ubicaciones')
      .then(response => response.json())
      .then(data => setUbicaciones(data));

    fetch('/api/recintos')
      .then(response => response.json())
      .then(data => setRecintos(data));

    fetch('/api/concentradores')
      .then(response => response.json())
      .then(data => setConcentradores(data));
    
      /*
    fetch('/api/sensores/all')
      .then(response => response.json())
      .then(data => setSensores(data));
      */
  }, []);

  useEffect(() => {
    if (concentradorSeleccionado) {
      fetch(`/api/sensores/${concentradorSeleccionado}`)
        .then(response => response.json())
        .then(data => setSensores(data));
    } else {
      setSensores([]); // Resetear sensores cuando no hay concentrador seleccionado
    }
  }, [concentradorSeleccionado]);

  const handleBuscar = (e) => {
    setBusqueda(e.target.value);
  };

  const handleCrearExperimento = async (event) => {
    event.preventDefault();
    const experimento = {
      titulo: nuevoExperimento.titulo,
      objetivo: nuevoExperimento.objetivo,
      descripcion: nuevoExperimento.descripcion,
      ubicacion: nuevoExperimento.ubicacion,
      concentrador: nuevoExperimento.concentrador,
      sensores: nuevoExperimento.sensores,
    };

    console.log('Datos enviados:', experimento); // Agregar esto para verificar los datos
  
    try {
      const response = await fetch('/api/experimentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experimento),
      });
  
      if (response.ok) {
        console.log('Experimento creado con éxito');
      } else {
        console.error('Error al crear experimento');
      }
    } catch (error) {
      console.error('Error al crear experimento:', error);
    }
  };

  const handleNuevoExperimento = (e) => {
    setNuevoExperimento({ ...nuevoExperimento, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (concentradorSeleccionado) {
      fetch(`/api/sensores/${concentradorSeleccionado}`)
        .then(response => response.json())
        .then(data => setSensores(data));
    }
  }, [concentradorSeleccionado]);

  return (
    <div>
      <Sidebar>
        <NavItem>Experimento</NavItem>
        <NavItem>Reportes</NavItem>
        <NavItem>Usuario</NavItem>
      </Sidebar>
      <main>
        <h1>Experimentos</h1>
        <input type="search" value={busqueda} onChange={handleBuscar} />
        <ul>
          {experimentos.map((experimento) => (
            <li key={experimento._id}>
              <h2>{experimento.titulo}</h2>
              <p>{experimento.objetivo}</p>
              <p>{experimento.descripcion}</p>
            </li>
          ))}
        </ul>
        <button onClick={() => setNuevoExperimento(true)}>Nuevo experimento</button>
        {nuevoExperimento && (
          <div>
            <h2>Crear experimento</h2>
            <form>
              <label>
                Título:
                <input type="text" name="titulo" value={nuevoExperimento.titulo} onChange={handleNuevoExperimento} />
              </label>
              <label>
                Objetivo:
                <input type="text" name="objetivo" value={nuevoExperimento.objetivo} onChange={handleNuevoExperimento} />
              </label>
              <label>
                Descripción:
                <input type="text" name="descripcion" value={nuevoExperimento.descripcion} onChange={handleNuevoExperimento} />
              </label>
              <label>
                Ubicación:
                <select name="ubicacion" value={nuevoExperimento.ubicacion} onChange={(e) => {
                  handleNuevoExperimento(e);
                  setUbicacionSeleccionada(e.target.value);
                }}>
                  <option value="">Seleccione una ubicación</option>
                  {ubicaciones.map((ubicacion) => (
                    <option value={ubicacion._id}>{ubicacion.área} - {ubicacion.recinto}</option>
                  ))}
                </select>
              </label>
              
              <label>
                Concentrador:
                <select name="concentrador" value={nuevoExperimento.concentrador} onChange={(e) => {
                  handleNuevoExperimento(e);
                  setConcentradorSeleccionado(e.target.value);
                }}>
                  <option value="">Seleccione un concentrador</option>
                  {concentradores.filter((concentrador) => concentrador.ubicación === ubicacionSeleccionada).map((concentrador) => (
                    <option value={concentrador._id}>{concentrador.placa} - {concentrador.ubicación}</option>
                  ))}
                </select>
              </label>
              
              <label>
                Sensores:
                <select multiple name="sensores" value={nuevoExperimento.sensores} onChange={(e) => {
                  const sensoresSeleccionados = Array.from(e.target.selectedOptions, (option) => option.text);
                  setNuevoExperimento({ ...nuevoExperimento, sensores: sensoresSeleccionados });
                }}>
                  {sensores.map((sensor) => (
                    <option value={sensor.tipo}>{sensor.tipo}</option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={handleCrearExperimento}>Crear experimento</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

function Sidebar({ children }) {
  return (
    <nav>
      <ul>
        {children}
      </ul>
    </nav>
  );
}

function NavItem({ children }) {
  return <li>{children}</li>;
}

export default App;












































/*
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/