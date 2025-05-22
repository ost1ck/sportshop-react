import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import ProductCard from '../components/ProductCard';
import CartModal from '../components/CartModal';
import Slogan from '../components/Slogan';
import Header from '../components/Header';
import styles from '../assets/styleOffers.module.css';

function Offers() {
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [showOnlyInStock, setShowOnlyInStock] = useState(true);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const productsList = await response.json();
        console.log('Завантажені продукти:', productsList);
        setProducts(productsList);
      } catch (error) {
        console.error('Помилка при завантаженні продуктів: ', error);
      }
    };

    const fetchPromotions = async () => {
      try {
        const response = await fetch('/api/promotions');
        if (!response.ok) throw new Error('Failed to fetch promotions');
        const promotionsList = await response.json();
        console.log('Завантажені акції:', promotionsList);
        setPromotions(promotionsList);
      } catch (error) {
        console.error('Помилка при завантаженні акцій: ', error);
      }
    };

    fetchProducts();
    fetchPromotions();
  }, []);

  const productsWithPromotions = products
    .map((product) => {
      const promotion = promotions.find((p) => p.productId === product.id);
      return promotion ? { ...product, badge: promotion.discount } : null;
    })
    .filter((product) => product !== null);
  console.log('Товари з акціями:', productsWithPromotions);

  const filteredProducts = showOnlyInStock
    ? productsWithPromotions.filter((product) => product.availability === 'На складі')
    : productsWithPromotions;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') {
      const priceA = parseFloat(a.price.replace(' грн', ''));
      const priceB = parseFloat(b.price.replace(' грн', ''));
      return priceA - priceB;
    } else if (sortBy === 'price-desc') {
      const priceA = parseFloat(a.price.replace(' грн', ''));
      const priceB = parseFloat(b.price.replace(' грн', ''));
      return priceB - priceA;
    } else if (sortBy === 'rating-asc') {
      const ratingA = a.rating.split('★').length - 1;
      const ratingB = b.rating.split('★').length - 1;
      return ratingA - ratingB;
    } else if (sortBy === 'rating-desc') {
      const ratingA = a.rating.split('★').length - 1;
      const ratingB = b.rating.split('★').length - 1;
      return ratingB - ratingA;
    }
    return 0;
  });

  return (
    <div>
      <Header />
      <main>
        <Navigation />
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ marginRight: '10px' }}>Сортувати за:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="default">За замовчуванням</option>
              <option value="price-asc">Ціна: від дешевих до дорогих</option>
              <option value="price-desc">Ціна: від дорогих до дешевих</option>
              <option value="rating-asc">Рейтинг: від низького до високого</option>
              <option value="rating-desc">Рейтинг: від високого до низького</option>
            </select>
          </div>
          <button
            className={styles.filterButton}
            onClick={() => setShowOnlyInStock(!showOnlyInStock)}
          >
            {showOnlyInStock ? 'Показати всі товари' : 'Показати лише в наявності'}
          </button>
          <section className={styles.products}>
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} showArrows={true} />
            ))}
          </section>
        </div>
        <Slogan />
        <CartModal />
      </main>
    </div>
  );
}

export default Offers;