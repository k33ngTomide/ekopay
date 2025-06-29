import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import LOGO from '../assets/ekopay_logo.png';

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
      _id
      email
    }
  }
`;

export default function Signup() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const [createUser, { loading }] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      toast.success(`Signup successful: ${data.createUser.email}`);
      // Redirect if needed
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser({ variables: { input: form } });
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
        Please create an account to continue
      </p>
      
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center font-montserrat">Sign Up</h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name *"
          value={form.fullName}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md font-montserrat"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md font-montserrat"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone * (Format: 08012345678)"
          value={form.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md font-montserrat"
          required
        />

        {/* Password Input with Eye Icon */}
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-montserrat"
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600 font-montserrat">
        Already have an account? <a href="/login" className="text-lg text-blue-600 hover:underline font-montserrat"> Login</a>
      </div>

    </div>
  );
}
