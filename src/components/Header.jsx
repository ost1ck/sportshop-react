// src/components/Header.jsx
import { useTheme } from '../context/ThemeContext'; // Додаємо useTheme

function Header() {
  const { theme, toggleTheme } = useTheme(); // Отримуємо поточну тему і функцію перемикання

  return (
    <header>
      <img src="/logo5.png" alt="Логотип магазину" width="100" />
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Темна тема' : '☀️ Світла тема'}
      </button>
    </header>
  );
}

export default Header;