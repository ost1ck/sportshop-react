// src/pages/Home.jsx
import Navigation from '../components/Navigation';
import Slogan from '../components/Slogan';
import CartModal from '../components/CartModal';
import Header from '../components/Header';
import styles from '../assets/styleFirst.module.css';

function Home() {
  return (
    <div>
      <Header />
      <main>
        <section className={styles.photoSection}>
          <div className={styles.overlay}>
            <Navigation showCart={false} />
          </div>
        </section>
        <Slogan />
        <CartModal />
      </main>
    </div>
  );
}

export default Home;