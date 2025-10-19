"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/redux/services/authApi";

const Register = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    contactNo: "",
    email: "",
    password: "",
  });

  const [registerUser, { isLoading, isError, error }] = useRegisterMutation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(form).unwrap();
      console.log("Register successful:", response);
      router.push("/dashboard");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
          Create an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleRegister} className="space-y-6">
          {/* FIRST NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-100">First Name</label>
            <input
              name="firstName"
              type="text"
              required
              value={form.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              className="mt-2 block w-full h-12 rounded-md bg-white/5 px-3 text-white placeholder-gray-500 focus:outline-indigo-500"
            />
          </div>

          {/* LAST NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-100">Last Name</label>
            <input
              name="lastName"
              type="text"
              required
              value={form.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className="mt-2 block w-full h-12 rounded-md bg-white/5 px-3 text-white placeholder-gray-500 focus:outline-indigo-500"
            />
          </div>

          {/* CONTACT */}
          <div>
            <label className="block text-sm font-medium text-gray-100">Contact No.</label>
            <input
              name="contactNo"
              type="text"
              required
              value={form.contactNo}
              onChange={handleChange}
              placeholder="Enter contact number"
              className="mt-2 block w-full h-12 rounded-md bg-white/5 px-3 text-white placeholder-gray-500 focus:outline-indigo-500"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-100">Email</label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-2 block w-full h-12 rounded-md bg-white/5 px-3 text-white placeholder-gray-500 focus:outline-indigo-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-100">Password</label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-2 block w-full h-12 rounded-md bg-white/5 px-3 text-white placeholder-gray-500 focus:outline-indigo-500"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex justify-center items-center w-full h-12 rounded-md bg-indigo-500 text-white font-semibold hover:bg-indigo-600"
            >
              {isLoading ? "Creating..." : "Register"}
            </button>

            {isError && (
              <p className="text-red-500 text-sm">
                {error?.data?.message || "Registration failed"}
              </p>
            )}

            <p className="text-gray-300 text-sm text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
