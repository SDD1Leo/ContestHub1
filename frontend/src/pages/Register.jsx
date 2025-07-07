import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { login , API } = useAuth() || {};
  const [load, setLoad] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true)
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (res.ok) {
        toast.success(data.msg || 'Registered successfully!');
        navigate('/login');
      } else {
        toast.warn(data.error || 'Registration failed.');
      }
    } catch (error) {
      toast.error('Error during registration, please try again.');
      console.error('Register error:', error);
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-primary mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded outline-none focus:ring-2 focus:ring-primary"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            type="email"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded outline-none focus:ring-2 focus:ring-primary"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded outline-none focus:ring-2 focus:ring-primary"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button
          type="submit"
          className="w-full bg-primary flex justify-center bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded transition duration-200"
          >
          {load ? 
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          :
           <>
           Register
           </> 
          }
          </button>
        </form>
        <div className="text-sm py-1 text-gray-400">
          Already a user?{" "}
          <button onClick={() => navigate("/login")} className="hover:text-gray-200">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
