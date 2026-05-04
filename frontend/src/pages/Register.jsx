import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    is_agent: false
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://127.0.0.1:8000/api/accounts/register/', formData);

      // Registration successful! Now log them in automatically
      const loginRes = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: formData.username,
        password: formData.password
      });

      localStorage.setItem('access_token', loginRes.data.access);
      localStorage.setItem('refresh_token', loginRes.data.refresh);
      localStorage.setItem('username', formData.username);

      window.location.href = formData.is_agent ? '/dashboard' : '/';
      
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        // Simple error formatting
        const firstErrorKey = Object.keys(err.response.data)[0];
        setError(`${firstErrorKey}: ${err.response.data[firstErrorKey]}`);
      } else {
        setError('Registration failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-primary hover:text-orange-600">
            Log in instead
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" name="username" required value={formData.username} onChange={handleChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input type="text" name="first_name" required value={formData.first_name} onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" name="last_name" required value={formData.last_name} onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} minLength={8}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              />
            </div>

            <div className="flex items-center mt-4 bg-orange-50 p-3 rounded-md border border-orange-100">
              <input
                id="is_agent" name="is_agent" type="checkbox" checked={formData.is_agent} onChange={handleChange}
                className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
              />
              <label htmlFor="is_agent" className="ml-2 block text-sm font-bold text-gray-900">
                Register as an Agent
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit" disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-70"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
