// src/pages/Register.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import styles from '../assets/styleRegister.module.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Підтвердження паролів
    if (password !== confirm) {
      showToast('Паролі не співпадають.', 'error');
      return;
    }
    // 2. Мінімальна довжина
    if (password.length < 6) {
      showToast('Пароль має містити щонайменше 6 символів.', 'error');
      return;
    }

    // 3. Запит до Firebase
    const result = await register(email, password);
    if (result.success) {
      showToast('Реєстрація пройшла успішно! Увійдіть, будь ласка.', 'success');
      navigate('/login');
    } else {
      switch (result.code) {
        case 'auth/email-already-in-use':
          showToast('Цей email вже зайнятий.', 'error');
          break;
        case 'auth/invalid-email':
          showToast('Неправильний формат email.', 'error');
          break;
        case 'auth/weak-password':
          showToast('Пароль занадто слабкий. Мінімум 6 символів.', 'error');
          break;
        default:
          showToast(`Помилка: ${result.message}`, 'error');
      }
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h1>Реєстрація</h1>
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
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Підтвердіть пароль"
          required
        />
        <button type="submit">Зареєструватися</button>
      </form>
    </div>
  );
}

export default Register;
