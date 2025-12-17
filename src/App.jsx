import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProductList from './components/ProductList';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

const Header = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 onClick={() => setCurrentView('products')}>🏃♂️ Sports Store</h1>
        <nav>
          <button onClick={() => setCurrentView('products')}>Products</button>
          {user ? (
            <>
              <button onClick={() => setCurrentView('cart')}>Cart</button>
              <span>Welcome, {user.name}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <button onClick={() => setCurrentView('auth')}>Login</button>
          )}
        </nav>
      </div>
    </header>
  );
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  return isLogin ? 
    <Login onToggle={() => setIsLogin(false)} /> : 
    <Register onToggle={() => setIsLogin(true)} />;
};

const AppContent = () => {
  const [currentView, setCurrentView] = useState('products');
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;

  const renderContent = () => {
    switch(currentView) {
      case 'products': return <ProductList />;
      case 'cart': return <Cart onCheckout={() => setCurrentView('checkout')} />;
      case 'checkout': return <Checkout onOrderComplete={() => setCurrentView('products')} />;
      case 'auth': return user ? setCurrentView('products') : <AuthPage />;
      default: return <ProductList />;
    }
  };

  return (
    <div className="app">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main>{renderContent()}</main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App