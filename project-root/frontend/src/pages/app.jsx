// frontend/src/pages/App.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [produkte, setProdukte] = useState([]);

  useEffect(() => {
    axios.get('/api/produkte')
      .then(res => setProdukte(res.data))
      .catch(err => console.error('Fehler beim Laden der Produkte:', err));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Grüezi! Willkommen im Bünzli Shop 🧀🇨🇭</h1>

      <ul className="space-y-4">
        {produkte.map(p => (
          <li key={p.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-gray-700">{p.description}</p>
            <p className="font-bold">CHF {p.price.toFixed(2)}</p>
            <button className="mt-2 px-4 py-1 bg-yellow-400 hover:bg-yellow-300 rounded">
              Is Waarechörbli leggä
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
