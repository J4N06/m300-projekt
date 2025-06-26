// admin/src/pages/App.jsx

import React, { useState } from 'react';
import Produkte from './Produkte';
import Bestellungen from './Bestellungen';

export default function App() {
  const [view, setView] = useState('produkte');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">👔 Bünzli Shop Admin</h1>

      <div className="mb-4 space-x-4">
        <button onClick={() => setView('produkte')} className="px-4 py-2 bg-blue-100 rounded">
          Produkte
        </button>
        <button onClick={() => setView('bestellungen')} className="px-4 py-2 bg-green-100 rounded">
          Bestellungen
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        {view === 'produkte' && <Produkte />}
        {view === 'bestellungen' && <Bestellungen />}
      </div>
    </div>
  );
}
