// admin/src/pages/Produkte.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Produkte() {
  const [produkte, setProdukte] = useState([]);
  const [neu, setNeu] = useState({ name: '', description: '', price: '' });

  useEffect(() => {
    ladeProdukte();
  }, []);

  async function ladeProdukte() {
    const res = await axios.get('/api/produkte');
    setProdukte(res.data);
  }

  async function hinzufuegen() {
    const token = localStorage.getItem('token');
    if (!token) return alert('Login nötig');
    try {
      await axios.post('/api/admin/produkte', neu, {
        headers: { Authorization: token }
      });
      setNeu({ name: '', description: '', price: '' });
      ladeProdukte();
    } catch (err) {
      alert('Fehler beim Hinzufügen');
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">🧀 Produkte verwalten</h2>

      <ul className="space-y-2 mb-6">
        {produkte.map(p => (
          <li key={p.id} className="border p-2">
            <strong>{p.name}</strong> – CHF {p.price.toFixed(2)}<br />
            <small>{p.description}</small>
          </li>
        ))}
      </ul>

      <h3 className="font-bold mb-2">Neues Produkt</h3>
      <input
        type="text"
        placeholder="Name"
        value={neu.name}
        onChange={(e) => setNeu({ ...neu, name: e.target.value })}
        className="border p-1 mr-2"
      />
      <input
        type="text"
        placeholder="Beschreibung"
        value={neu.description}
        onChange={(e) => setNeu({ ...neu, description: e.target.value })}
        className="border p-1 mr-2"
      />
      <input
        type="number"
        placeholder="Preis"
        value={neu.price}
        onChange={(e) => setNeu({ ...neu, price: e.target.value })}
        className="border p-1 mr-2 w-24"
      />
      <button onClick={hinzufuegen} className="bg-blue-600 text-white px-3 py-1 rounded">
        Hinzufügen
      </button>
    </div>
  );
}
