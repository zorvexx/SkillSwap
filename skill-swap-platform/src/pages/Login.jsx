import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase'; // make sure this is correct
import logo from '../Images/Swap-removebg-preview.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      navigate('/'); // or home page route
    } catch (err) {
      setError("Invalid email or password");
      console.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col px-4">
      {/* Top Navigation with Logo */}
      <nav className="w-full flex items-center justify-start p-4">
        <img src={logo} alt="SkillSwap Logo" className="w-auto h-32 object-contain -mt-12" />
      </nav>

      {/* Centered Login Section */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to SkillSwap</h1>

        <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign in</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-600 mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-semibold hover:scale-105 hover:shadow-lg active:scale-95 transition"
            >
              Login
            </button>

            {/* Show error if login fails */}
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <p className="text-sm text-center text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-600 hover:underline">Create one</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
