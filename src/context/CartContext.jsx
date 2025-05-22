import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const auth = useAuth();
  const toastContext = useToast();
  if (!toastContext) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  const { showToast } = toastContext;

  const user = auth?.user;
  console.log('Current user:', user);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (!auth || !user) {
      console.log('Auth or user not initialized, using localStorage');
      const savedCart = localStorage.getItem('cart');
      const savedWishlist = localStorage.getItem('wishlist');
      setCart(savedCart ? JSON.parse(savedCart) : []);
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
      setIsDataLoaded(false);
      return;
    }

    console.log('User logged in, loading data from server:', user.uid);

    const loadFromServer = async () => {
      try {
        const cartResponse = await fetch(`/api/cart/${user.uid}`);
        const wishlistResponse = await fetch(`/api/wishlist/${user.uid}`);

        const cartData = cartResponse.status === 404 ? [] : await cartResponse.json();
        const wishlistData = wishlistResponse.status === 404 ? [] : await wishlistResponse.json();

        console.log('Loaded cart from server:', cartData);
        console.log('Loaded wishlist from server:', wishlistData);

        localStorage.removeItem('cart');
        localStorage.removeItem('wishlist');

        setCart(cartData);
        setWishlist(wishlistData);
        localStorage.setItem('cart', JSON.stringify(cartData));
        localStorage.setItem('wishlist', JSON.stringify(wishlistData));
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error loading data from server:', error);
        setFetchError('Помилка завантаження даних');
      }
    };

    loadFromServer();
  }, [user, auth]);

  useEffect(() => {
    if (fetchError) {
      showToast(fetchError, 'error');
      setFetchError(null);
    }
    if (toastMessage) {
      showToast(toastMessage.message, toastMessage.type);
      setToastMessage(null);
    }
  }, [fetchError, toastMessage, showToast]);

  const saveToServer = async (collectionName, data) => {
    if (!user) {
      console.log('No user, skipping server save');
      return;
    }
    const endpoint = collectionName === 'carts' ? `/api/cart/${user.uid}` : `/api/wishlist/${user.uid}`;
    console.log(`Sending request to ${endpoint} with data:`, data);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: data }),
      });
      if (!response.ok) throw new Error(`Failed to save to ${collectionName}`);
      const result = await response.json();
      if (collectionName === 'carts') setCart(result.items);
      if (collectionName === 'wishlists') setWishlist(result.items);
      console.log(`Successfully saved to ${collectionName}:`, result.items);
    } catch (error) {
      console.error(`Error saving to ${collectionName}:`, error);
      setFetchError(`Помилка збереження ${collectionName}`);
    }
  };

  const addToCart = (item) => {
    if (!user) {
      setToastMessage({ message: 'Будь ласка, увійдіть в акаунт, щоб додати до кошика', type: 'info' });
      return;
    }
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCart = [...prevCart, { ...item, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      saveToServer('carts', updatedCart);
      setToastMessage({ message: `${item.name} доданий до кошика`, type: 'success' });
      return updatedCart;
    });
  };

  const addToWishlist = (item) => {
    if (!user) {
      setToastMessage({ message: 'Будь ласка, увійдіть в акаунт, щоб додати до списку бажань', type: 'info' });
      return;
    }
    setWishlist((prevWishlist) => {
      if (prevWishlist.some((wishlistItem) => wishlistItem.id === item.id)) {
        setToastMessage({ message: `${item.name} уже є в списку бажань`, type: 'info' });
        return prevWishlist;
      }
      const updatedWishlist = [...prevWishlist, item];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      saveToServer('wishlists', updatedWishlist);
      setToastMessage({ message: `${item.name} доданий до списку бажань`, type: 'success' });
      return updatedWishlist;
    });
  };

  const removeFromWishlist = (itemId) => {
    console.log('Removing item from wishlist, itemId:', itemId);
    setWishlist((prevWishlist) => {
      const updatedWishlist = prevWishlist.filter((item) => item.id !== itemId);
      console.log('Updated wishlist:', updatedWishlist);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      saveToServer('wishlists', updatedWishlist);
      setToastMessage({ message: 'Товар видалений зі списку бажань', type: 'info' });
      return updatedWishlist;
    });
  };

  const updateCart = (index, newQuantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item, i) => (i === index ? { ...item, quantity: Math.max(0, newQuantity) } : item))
        .filter((item) => item.quantity > 0);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      saveToServer('carts', updatedCart);
      if (newQuantity <= 0) {
        const removedItem = prevCart[index];
        setToastMessage({ message: `${removedItem.name} видалений з кошика`, type: 'error' });
      }
      return updatedCart;
    });
  };

  const value = {
    cart,
    setCart,
    addToCart,
    updateCart,
    wishlist,
    setWishlist,
    addToWishlist,
    removeFromWishlist,
    isCartOpen,
    setIsCartOpen,
    showToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
export { CartContext };