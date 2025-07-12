import React, { useState } from 'react';
import { auth, database } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../Images/Swap-removebg-preview.png';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirm] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validations
    if (email !== confirmEmail) {
      setError("Emails do not match");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user info to Realtime DB
      await set(ref(database, 'users/' + user.uid), {
        name: fullName,
        email: email
      });

      console.log("Registration complete");
      navigate('/login'); // Navigate to login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col px-4">
      {/* Logo Nav */}
      <nav className="w-full flex items-center justify-start p-4">
        <img src={logo} alt="SkillSwap Logo" className="w-auto h-32 object-contain -mt-12" />
      </nav>

      <div className="flex flex-col items-center justify-center flex-grow pb-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to SkillSwap</h1>

        <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Register</h2>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
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

            {/* Confirm Email */}
            <div>
              <label htmlFor="confirm_email" className="block text-sm text-gray-600 mb-1">Confirm Email</label>
              <input
                type="email"
                id="confirm_email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm_password" className="block text-sm text-gray-600 mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Register
            </button>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Link to Login */}
            <p className="text-sm text-center text-gray-500">
              Already have an account?{' '}
              <Link to="/" className="text-purple-600 hover:underline">Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
