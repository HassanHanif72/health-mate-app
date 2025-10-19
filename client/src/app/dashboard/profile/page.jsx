"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/constants/api";
import { LogOut, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const Router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Fetch user data
  const loadUser = async () => {
    const res = await fetch(`${API_URL}/user/user-data`, { credentials: "include" });
    const data = await res.json();
    setUser(data);
    setForm(data);
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Handle form update
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Upload profile image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setImageUploading(true);

    const res = await fetch(`${API_URL}/file/upload`, {
      method: "POST",
      credentials: "include",
      body: formData
    });

    const data = await res.json();
    if (res.ok) {
      setForm({ ...form, profileImage: data.file.fileUrl });
      alert("✅ Profile image updated!");
    }

    setImageUploading(false);
  };

  // Save user
  const handleSave = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/public/update-user/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(res.ok ? "✅ Profile updated" : `❌ ${data.message}`);
    setLoading(false);
  };

  // Logout
  const handleLogout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    Router.push("/login");
  };

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Left: Profile Card */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
        <img
          src={form.profileImage || "/default-avatar.png"}
          className="w-32 h-32 rounded-full object-cover border"
          alt="profile"
        />

        <label className="mt-4 flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-700">
          <Upload size={16} /> Change Photo
          <input type="file" className="hidden" onChange={handleImageUpload} />
        </label>

        <h3 className="mt-3 text-lg font-semibold text-gray-800">{user.firstName} {user.lastName}</h3>
        <p className="text-gray-500 text-sm">{user.email}</p>

        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-2 bg-red-600 text-white w-full justify-center py-2 rounded hover:bg-red-700"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Right: Editable Form */}
      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input className="border p-2 rounded" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
          <input className="border p-2 rounded" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
          <input className="border p-2 rounded" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input className="border p-2 rounded" name="contactNumber" placeholder="Contact Number" value={form.contactNumber || ""} onChange={handleChange} />
          <input className="border p-2 rounded" name="age" type="number" placeholder="Age" value={form.age || ""} onChange={handleChange} />
          
          <select className="border p-2 rounded" name="gender" value={form.gender || ""} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <select className="border p-2 rounded" name="bloodGroup" value={form.bloodGroup || ""} onChange={handleChange}>
            <option value="">Blood Group</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
            <option>O+</option><option>O-</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
