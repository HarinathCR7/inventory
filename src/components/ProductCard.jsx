import { cartAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { user } = useAuth();

  const addToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await cartAPI.addToCart(product._id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="brand">{product.brand}</p>
        <p className="category">{product.category}</p>
        <p className="price">${product.price}</p>
        <div className="rating">
          ⭐ {product.rating} ({product.numReviews} reviews)
        </div>
        <p className="stock">Stock: {product.stock}</p>
        <button className="add-to-cart-btn" onClick={addToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;