import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import ArchivosCSV from './pages/ArchivosCSV.jsx';
import Experimentos from './pages/Experimentos.jsx';
import Reportes from './pages/Reportes.jsx';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Sidebar>
        <Routes>
        <Route exact path="/" element={<Experimentos />} />
          <Route path="/experimentos"element={<Experimentos/>}/>
          <Route path="/dashboard"element={<Dashboard/>}/>
          <Route path="/reportes"element={<Reportes/>}/>
          <Route path="/archivosCSV"element={<ArchivosCSV/>}/>
        </Routes>
      </Sidebar>
    </BrowserRouter>
  );

};

export default App;