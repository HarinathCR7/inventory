import { useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Cart = ({ onCheckout }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await cartAPI.updateCart(productId, quantity);
      setCart(response.data);
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await cartAPI.removeFromCart(productId);
      setCart(response.data);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (!user) return <div className="cart-message">Please login to view cart</div>;
  if (loading) return <div className="loading">Loading cart...</div>;

  return (
    <div className="cart">
      <h2>Shopping Cart ({cart.items?.length || 0} items)</h2>
      {cart.items?.length === 0 ? (
        <div className="empty-cart">Your cart is empty</div>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.product._id} className="cart-item">
                <img src={item.product.image} alt={item.product.name} />
                <div className="item-details">
                  <h4>{item.product.name}</h4>
                  <p>${item.price}</p>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                </div>
                <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>
                <button className="remove-btn" onClick={() => removeItem(item.product._id)}>×</button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ${cart.totalAmount?.toFixed(2)}</h3>
            <button className="checkout-btn" onClick={onCheckout}>Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;