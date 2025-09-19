import React, { useState } from 'react';
import HomePage from './components/HomePage';
import ScanPage from './components/ScanPage';
import { Material } from './types/material';

type View = 'home' | 'scan';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [materials, setMaterials] = useState<Material[]>([]);

  const handleStartScan = () => {
    setCurrentView('scan');
  };

  const handleValidateScan = (scannedMaterials: Material[]) => {
    setMaterials(prev => [...prev, ...scannedMaterials]);
    setCurrentView('home');
  };

  const handleCancelScan = () => {
    setCurrentView('home');
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(material => material.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer tous les matériels ?')) {
      setMaterials([]);
    }
  };

  return (
    <>
      {currentView === 'home' && (
        <HomePage
          materials={materials}
          onStartScan={handleStartScan}
          onDeleteMaterial={handleDeleteMaterial}
          onClearAll={handleClearAll}
        />
      )}
      {currentView === 'scan' && (
        <ScanPage
          onValidate={handleValidateScan}
          onCancel={handleCancelScan}
        />
      )}
    </>
  );
}

export default App;