import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import LOGO from '../assets/ekopay_logo.png';

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(loginInput: $input) {
      accessToken
      user {
        _id
        email
      }
    }
  }
`;

export default function Login() {
  const [form, setForm] = useState({ credential: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { setToken } = useAuthStore();
  const navigate = useNavigate();

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      toast.success(`Welcome back, ${data.login.user.fullName}`);
      setToken(data.login.accessToken);
      navigate('/dashboard');
    },
    onError: (error) => toast.error(error.message),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ variables: { input: form } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="flex text-center mb-8 items-center justify-center gap-3">
        <img
          src={LOGO}
          alt="Ekopay Icon"
          className="w-24 h-20 mx-auto mb-2"
        />
        <h1 className="text-3xl font-bold mb-4 font-montserrat">Ekopay</h1>
      </div>
      
      <p className="text-lg text-gray-700 mb-2 font-montserrat">
        Your secure payment gateway
      </p>
      <p className="text-sm text-gray-500 mb-6 font-montserrat">
        Please login to continue
      </p>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center font-montserrat">Login</h2>

        <input
          type="text"
          name="credential"
          placeholder="Email or Account Number *"
          value={form.credential}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md font-montserrat"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password *"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md font-montserrat pr-10"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500 cursor-pointer text-sm"
          >
            {showPassword ? '👁️' : '👁️'}
          </span>
        </div>

        <p className="mt-2 text-center text-sm text-gray-600 font-montserrat">
          <a href="/forgot-password" className="text-green-600 hover:underline">Forgot Password?</a>
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-montserrat"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600 font-montserrat">
        Don't have an account? <a href="/signup" className="text-green-600 hover:underline">Sign Up</a>
      </p>
    </div>
  );
}
