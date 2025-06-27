// frontend/src/pages/Kasse.jsx

import React, { useState } from 'react';
import { useCart } from '../state/CartContext';
import axios from 'axios';

export default function Kasse() {
  const { cart, clearCart } = useCart();
  const [message, setMessage] = useState(null);

  async function handleBestellen() {
    const token = localStorage.getItem('token');
    if (!token) return setMessage('Du musst eingeloggt sein!');

    try {
      await axios.post('/api/bestellung', {
        email: 'kunde@example.ch',
        items: cart
      }, {
        headers: { Authorization: token }
      });

      clearCart();
      setMessage('Merci für dini Bstellig! 🧀');
    } catch (err) {
      setMessage('Bestellung fehlgeschlagen');
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">💳 Zur Kasse</h2>
      {message && <p className="mb-4 text-blue-700">{message}</p>}
      <button
        onClick={handleBestellen}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-400"
      >
        Bestellung abschicken
      </button>
    </div>
  );
}
