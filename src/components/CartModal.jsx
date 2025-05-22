import { useCart } from '../context/CartContext';

function CartModal() {
  const { cart, setCart, isCartOpen, setIsCartOpen, updateCart } = useCart();

  if (!isCartOpen) return null;

  if (!Array.isArray(cart)) {
    return (
      <div className="cart-modal">
        <div className="cart-modal-content">
          <span className="cart-modal-close" onClick={() => setIsCartOpen(false)}>×</span>
          <h2>Кошик</h2>
          <p className="empty-cart">Помилка завантаження кошика</p>
        </div>
      </div>
    );
  }

  const totalPrice = cart.reduce((sum, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(' грн', '')) 
      : item.price;
    return sum + price * item.quantity;
  }, 0);

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <div className="cart-modal">
      <div className="cart-modal-content">
        <span className="cart-modal-close" onClick={() => setIsCartOpen(false)}>×</span>
        <h2>Кошик</h2>
        {cart.length === 0 ? (
          <p className="empty-cart">Кошик порожній</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item, index) => (
                <div className="cart-item" key={index}>
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">{item.price} грн</span>
                  <div className="cart-item-quantity">
                    <button onClick={() => updateCart(index, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateCart(index, item.quantity + 1)}>+</button>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => updateCart(index, 0)}
                  >
                    Видалити
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-total">Загальна сума: {totalPrice} грн</div>
            <button
              className="cart-clear"
              onClick={handleClearCart}
              disabled={cart.length === 0}
            >
              Очистити кошик
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CartModal;