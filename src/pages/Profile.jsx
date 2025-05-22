import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Slogan from '../components/Slogan';
import CartModal from '../components/CartModal';
import Header from '../components/Header';
import styles from '../assets/styleProfile.module.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const navigate = useNavigate();
  const { addToCart, showToast, wishlist, removeFromWishlist } = useCart();
  const { isLoggedIn, logout, user } = useAuth();

  useEffect(() => {
    console.log('Auth state in Profile:', { isLoggedIn, user });
    if (!isLoggedIn || !user) {
      console.log('User not logged in or user is undefined');
    }
  }, [isLoggedIn, user]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('cart');
    navigate('/');
  };

  const handleAddToCartFromWishlist = (item) => {
    if (!isLoggedIn) {
      showToast('Будь ласка, увійдіть в акаунт, щоб додати до кошика', 'info');
      return;
    }
    const normalizedItem = {
      id: item.id,
      name: item.name,
      price: typeof item.price === 'string' ? parseFloat(item.price.replace(' грн', '')) : item.price,
      quantity: 1,
    };
    addToCart(normalizedItem);
  };

  const handleRemoveFromWishlist = (itemId) => {
    console.log('Profile: Removing item with id:', itemId); // Додаємо лог
    removeFromWishlist(itemId);
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.loginPrompt}>
        <h2>Ви не увійшли в акаунт</h2>
        <p>Будь ласка, увійдіть, щоб переглянути профіль.</p>
        <button className={styles.loginButton} onClick={() => navigate('/login')}>
          Увійти
        </button>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main>
        <Navigation showCart={false} />
        <section className={styles.profileContainer}>
          <h2>Мій профіль</h2>
          <img src="/ProfilePhoto.png" alt="Фото профілю" className={styles.avatar} />
          <div className={styles.profileInfo}>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          <section className={styles.orderHistory}>
            <h3>Мої замовлення</h3>
            <ul>{/* Тут можна додати логіку для замовлень */}</ul>
          </section>

          <section className={styles.wishlist}>
            <h3>Бажані товари</h3>
            {wishlist.length === 0 ? (
              <p>Список бажань порожній</p>
            ) : (
              <ul>
                {wishlist.map((item) => (
                  <li key={item.id}>
                    <span>{item.name} — {item.price} грн</span>
                    <button onClick={() => handleAddToCartFromWishlist(item)}>
                      До кошика
                    </button>
                    <button onClick={() => handleRemoveFromWishlist(item.id)}>
                      Видалити
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <button className={styles.logoutButton} onClick={handleLogout}>
            Вийти
          </button>
        </section>
        <Slogan />
        <CartModal />
      </main>
    </div>
  );
}

export default Profile;