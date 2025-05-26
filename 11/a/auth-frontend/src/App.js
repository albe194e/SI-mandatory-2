import logo from './logo.svg';
import './App.css';

function App() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:4000/auth/google';
  };

  return (
    <div>
      <h1>Login with Google</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
export default App;
