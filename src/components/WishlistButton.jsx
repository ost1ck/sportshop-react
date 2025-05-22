import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import styles from './WishlistButton.module.css';

function WishlistButton({ product }) {
  const { user } = useAuth();
  const { wishlist, addToWishlist } = useCart();

  const isInWishlist = (productId) => wishlist.some((item) => item.id === productId);

  const handleAddToWishlist = () => {
    if (!user) {
      toast.info('Будь ласка, увійдіть в акаунт, щоб додати до списку бажань');
      return;
    }

    if (isInWishlist(product.id)) {
      toast.info('Вже додано до бажаного!');
    } else {
      addToWishlist(product);
      toast.success(`${product.name} додано до бажаного!`);
    }
  };

  const isProductInWishlist = isInWishlist(product.id);

  return (
    <button
      onClick={handleAddToWishlist}
      disabled={!user || isProductInWishlist}
      className={`${styles.wishlistButton} ${isProductInWishlist ? styles.inWishlist : ''}`}
    >
      {user ? (isProductInWishlist ? 'У списку бажаного' : 'Додати до бажаного') : 'Увійдіть для додавання'}
    </button>
  );
}

export default WishlistButton;