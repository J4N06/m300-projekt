// frontend/src/pages/Warenkorb.jsx

import React from 'react';
import { useCart } from '../state/CartContext';
import { Link } from 'react-router-dom';

export default function Warenkorb() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛒 Dein Chörbli</h2>

      {cart.length === 0 ? (
        <p>Du hesch no nüt im Chörbli 🧺</p>
      ) : (
        <div>
          <ul className="space-y-2">
            {cart.map((item, i) => (
              <li key={i} className="flex justify-between border p-2">
                <span>{item.name} – CHF {item.price.toFixed(2)}</span>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => removeFromCart(i)}
                >
                  Entfernen
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-4 font-bold">Total: CHF {total.toFixed(2)}</p>

          <div className="mt-4 space-x-4">
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded"
            >
              Leeren
            </button>
            <Link
              to="/kasse"
              className="px-4 py-2 bg-green-500 text-white hover:bg-green-400 rounded"
            >
              Zur Kasse
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}