'use client'
// import axios from 'axios';
import { useLoginMutation } from '@/redux/services/authApi';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useState } from 'react'

const login = () => {
  const Router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [login, { isLoading, isError, error }] = useLoginMutation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(form).unwrap();
      console.log("Login successful:", response);
      if (response) {
        Router.push('/');
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Sign in to your account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder='Enter your email'
                autoComplete="email"
                className="block w-full h-12 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder='Enter your password'
                autoComplete="current-password"
                className="block w-full h-12 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <button type="submit" className="flex cursor-pointer w-full h-12 justify-center items-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Sign in'}
            </button>
            {isError && <p className="text-red-500">{error?.data?.message || "Error"}</p>}
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <p className="font-semibold text-white">Don&apos;t have an account? <Link className='font-semibold text-indigo-400 hover:text-indigo-300' href="/register">Register</Link></p>
              </div>
            </div>
          </div>
        </form>


      </div>
    </div>
  )
}

export default login