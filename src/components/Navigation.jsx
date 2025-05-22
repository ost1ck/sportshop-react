// src/components/Navigation.jsx
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function Navigation({ showCart = true }) {
  const { cart, setIsCartOpen } = useContext(CartContext);
  const location = useLocation();
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0); // Додаємо || 0 на випадок, якщо quantity відсутнє

  return (
    <section className="navigation-buttons">
      <div className="buttons-container">
        {location.pathname !== '/' && (
          <Link to="/" className="nav-button">Головна</Link>
        )}
        {location.pathname !== '/products' && (
          <Link to="/products" className="nav-button">Продукти</Link>
        )}
        {location.pathname !== '/offers' && (
          <Link to="/offers" className="nav-button">Акції</Link>
        )}
        {location.pathname !== '/profile' && (
          <Link to="/profile" className="nav-button">Мій профіль</Link>
        )}
        {location.pathname !== '/about' && (
          <Link to="/about" className="nav-button">Про нас</Link>
        )}
      </div>
      {showCart && (
        <div className="cart" onClick={() => setIsCartOpen(true)}>
          <img src="/koshik-removebg-preview.png" alt="Кошик" className="cart-icon" />
          <span className="cart-count">{totalItems > 0 ? totalItems : '0'}</span>
        </div>
      )}
    </section>
  );
}

export default Navigation;