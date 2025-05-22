// src/pages/About.jsx
import Navigation from '../components/Navigation';
import Slogan from '../components/Slogan';
import CartModal from '../components/CartModal';
import Header from '../components/Header';
import styles from '../assets/styleAbout.module.css';

function About() {
  return (
    <div>
      <Header />
      <main>
        <Navigation showCart={false} /> {/* Додаємо showCart={false} */}
        <section className={styles.aboutUs}>
          <div className={styles.aboutContent}>
            <h2>Про нас</h2>
            <p>Ми — команда ентузіастів, яка створила цей спортивний магазин з єдиною метою: надихати людей на здоровий, активний та цілеспрямований спосіб життя.</p>
            <h3>Наша місія</h3>
            <p>Ми прагнемо забезпечити наших клієнтів найкращим спортивним спорядженням, яке допоможе їм досягати своїх цілей — незалежно від рівня підготовки. Ми віримо, що спорт змінює не лише тіло, а й характер.</p>
            <h3>Наші цінності</h3>
            <ul>
              <li><strong>Якість:</strong> Ми обираємо лише перевірені бренди, щоб гарантувати найкращі результати.</li>
              <li><strong>Довіра:</strong> Ми цінуємо кожного клієнта й будуємо довготривалі стосунки.</li>
              <li><strong>Інновації:</strong> Ми постійно оновлюємо асортимент, щоб ви були на крок попереду.</li>
              <li><strong>Підтримка:</strong> Ми поряд на кожному етапі вашого спортивного шляху.</li>
            </ul>
          </div>
        </section>
        <Slogan />
        <CartModal />
      </main>
    </div>
  );
}

export default About;