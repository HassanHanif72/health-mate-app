"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/constants/api";
import { PlusCircle, Trash2 } from "lucide-react";

export default function VitalsPage() {
    const [bp, setBp] = useState("");
    const [sugar, setSugar] = useState("");
    const [weight, setWeight] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [error, setError] = useState("");

    const loadVitals = async () => {
        setError("");
        try {
            const res = await fetch(`${API_URL}/vitals/my-vitals`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to fetch vitals");
            const data = await res.json();
            setList(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError(err.message || "Error loading vitals");
        }
    };

    useEffect(() => {
        loadVitals();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const payload = {
                bp: bp || undefined,
                sugar: sugar !== "" ? Number(sugar) : undefined,
                weight: weight !== "" ? Number(weight) : undefined,
                notes: notes || "",
            };

            const res = await fetch(`${API_URL}/vitals/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to add vitals");

            // prepend new item for instant UI feedback
            setList(prev => [data.vitals, ...prev]);
            setBp(""); setSugar(""); setWeight(""); setNotes("");
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not save vitals");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this vitals entry?")) return;
        try {
            const res = await fetch(`${API_URL}/vitals/delete/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.message || "Delete failed");
            }
            setList(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            alert(err.message || "Delete failed");
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-md shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Add Vitals</h2>
                {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

                <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                        <label className="block text-sm text-gray-600 mb-1">BP (e.g. 120/80)</label>
                        <input
                            value={bp}
                            onChange={(e) => setBp(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="120/80"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Sugar (mg/dL)</label>
                        <input
                            value={sugar}
                            onChange={(e) => setSugar(e.target.value)}
                            type="number"
                            className="w-full border rounded px-3 py-2"
                            placeholder="95"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
                        <input
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            type="number"
                            className="w-full border rounded px-3 py-2"
                            placeholder="75"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label className="block text-sm text-gray-600 mb-1">Notes (optional)</label>
                        <input
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="e.g. fasting, after meal..."
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            <PlusCircle size={16} /> {loading ? "Saving..." : "Save Vitals"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-4 rounded-md shadow-sm">
                <h3 className="text-md font-semibold text-gray-700 mb-3">History</h3>

                {list.length === 0 ? (
                    <p className="text-gray-500">No vitals recorded yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-sm text-gray-500 border-b">
                                    <th className="py-2">Date</th>
                                    <th className="py-2">BP</th>
                                    <th className="py-2">Sugar</th>
                                    <th className="py-2">Weight</th>
                                    <th className="py-2">Notes</th>
                                    <th className="py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list?.map((item) => (
                                    <tr key={item._id} className="border-b">
                                        <td className="py-3 text-sm text-gray-600">{new Date(item.date).toLocaleString()}</td>
                                        <td className="py-3 text-sm text-gray-700">{item.bp || "-"}</td>
                                        <td className="py-3 text-sm text-gray-700">{item.sugar ?? "-"}</td>
                                        <td className="py-3 text-sm text-gray-700">{item.weight ?? "-"}</td>
                                        <td className="py-3 text-sm text-gray-700">{item.notes || "-"}</td>
                                        <td className="py-3">
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="inline-flex items-center gap-2 text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
