import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5001/api/users/login', {
        email,
        password,
      });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        navigate('/');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <form
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
