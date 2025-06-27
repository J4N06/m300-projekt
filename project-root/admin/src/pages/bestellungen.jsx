// admin/src/pages/Bestellungen.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Bestellungen() {
  const [bestellungen, setBestellungen] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('/api/admin/bestellungen', {
      headers: { Authorization: token }
    })
      .then(res => setBestellungen(res.data))
      .catch(() => alert('Fehler beim Laden der Bestellungen'));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📦 Bestellungen</h2>
      {bestellungen.length === 0 ? (
        <p>Noch keine Bestellungen</p>
      ) : (
        <ul className="space-y-3">
          {bestellungen.map(b => (
            <li key={b.id} className="border p-3 rounded">
              <p><strong>Kunde:</strong> {b.email}</p>
              <p><strong>Datum:</strong> {new Date(b.created_at).toLocaleString()}</p>
              <ul className="list-disc list-inside mt-2">
                {b.items.map((item, i) => (
                  <li key={i}>{item.name} – CHF {item.price.toFixed(2)}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}