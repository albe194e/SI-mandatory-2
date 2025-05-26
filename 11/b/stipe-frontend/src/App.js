import logo from './logo.svg';
import './App.css';

function App() {
  const handleCheckout = async () => {
    const res = await fetch('http://localhost:4000/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div>
      <h1>Stripe Payment Example</h1>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
}

export default App;
