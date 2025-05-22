// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import styles from '../assets/styleLogin.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, password);
    if (result.success) {
      showToast('Успішно увійшли!', 'success');
      navigate('/profile');
    } else {
      switch (result.code) {
        case 'auth/user-not-found':
          showToast('Користувача з таким email не знайдено.', 'error');
          break;
        case 'auth/wrong-password':
          showToast('Невірний пароль.', 'error');
          break;
        case 'auth/invalid-email':
          showToast('Неправильний формат email.', 'error');
          break;
        default:
          showToast(`Помилка: ${result.message}`, 'error');
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1>Вхід</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Електронна пошта"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Пароль"
          required
        />
        <button type="submit">Увійти</button>
      </form>
      <div className={styles.registerLink}>
        <Link to="/register">Зареєструватися</Link>
      </div>
    </div>
  );
}

export default Login;
