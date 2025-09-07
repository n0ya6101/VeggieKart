'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = isLoginMode ? 'http://localhost:5001/api/auth/login' : 'http://localhost:5001/api/auth/register';
    const body = isLoginMode ? { phone, password } : { name, phone, password };
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (isLoginMode) {
        await login(data.token); // FIX: Pass only the token to the login function
        router.push('/'); // Redirect to homepage on successful login
      } else {
        // Switch to login mode after successful registration
        alert('Registration successful! Please log in.');
        setIsLoginMode(true);
        setPassword('');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-green-600">VeggieKart</Link>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {isLoginMode ? 'Welcome Back!' : 'Create an Account'}
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
           {!isLoginMode && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-800">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-800">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
            >
              {isLoading ? 'Processing...' : (isLoginMode ? 'Login' : 'Register')}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={() => { setIsLoginMode(!isLoginMode); setError(null); }} className="ml-1 font-medium text-green-600 hover:underline">
            {isLoginMode ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}