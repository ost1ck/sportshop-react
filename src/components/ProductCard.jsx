// src/components/ProductCard.jsx
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import WishlistButton from './WishlistButton';

function ProductCard({ product, showArrows = false }) {
  const { cart, addToCart } = useCart();
  const [showDescription, setShowDescription] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isInCart = cart.some((item) => item.name === product.name);

  const images = [product.image];
  if (product.image2) images.push(product.image2);

  useEffect(() => {
    setShowDescription(false);
  }, []);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    // Нормалізуємо ціну: видаляємо " грн" і конвертуємо в число
    const priceNumber = parseFloat(product.price.replace(' грн', ''));
    const item = {
      id: product.id, // Додаємо id для унікальності
      name: product.name,
      price: priceNumber, // Зберігаємо як число
      quantity: 1,
    };
    addToCart(item);
  };

  return (
    <div className="productCard">
      {product.badge && <div className="badge">{product.badge}</div>}
      {showArrows && images.length > 1 ? (
        <div className="imageWrapper">
          <button className="arrow arrow-left" onClick={handlePrevImage}>←</button>
          <img src={images[currentImageIndex]} alt={product.name} className="productImage" />
          <button className="arrow arrow-right" onClick={handleNextImage}>→</button>
        </div>
      ) : (
        <div className="imageWrapper">
          <img src={images[currentImageIndex]} alt={product.name} className="productImage" />
        </div>
      )}
      <p>{product.name}</p>
      <div className="rating">{product.rating}</div>
      <p className="price">{product.price}</p>
      <p className={`availability ${product.availability === 'Немає в наявності' ? 'outOfStock' : ''}`}>
        {product.availability}
      </p>
      <button
        className="addToCart"
        disabled={product.availability === 'Немає в наявності' || isInCart}
        onClick={handleAddToCart}
      >
        {isInCart ? 'Товар у кошику' : 'Додати до кошика'}
      </button>
      <WishlistButton product={product} />
      <button
        className="toggleDescription"
        onClick={() => setShowDescription(!showDescription)}
      >
        {showDescription ? 'Приховати опис' : 'Показати опис'}
      </button>
      {showDescription && <div className="description">{product.description}</div>}
    </div>
  );
}

export default ProductCard;