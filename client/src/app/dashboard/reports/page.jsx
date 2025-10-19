"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/constants/api";
import { FileText, Eye, Brain } from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadReports() {
            try {
                const res = await fetch(`${API_URL}/file/my-files`, {
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to fetch reports");
                const data = await res.json();
                setReports(data || []);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadReports();
    }, []);

    const handleAISummary = async (fileId) => {
        if (!confirm("Run AI analysis for this report?")) return;
        try {
            const res = await fetch(`${API_URL}/ai/process-file`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ fileId }),
            });
            const data = await res.json();
            if (res.ok) alert("✅ AI Summary generated successfully!");
            else alert(`❌ ${data.message}`);
        } catch (err) {
            alert("AI processing failed");
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-md p-6 text-gray-500">Loading reports...</div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
        );
    }

    if (reports.length === 0) {
        return (
            <div className="bg-white rounded-md p-6 text-center text-gray-600">
                <FileText className="mx-auto mb-2 text-gray-400" size={40} />
                <p>No reports found.</p>
                <Link
                    href="/dashboard/upload-report"
                    className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Upload New Report
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Reports</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports?.map((report) => (
                    <div
                        key={report._id}
                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <FileText className="text-blue-600" size={24} />
                            <h3 className="font-semibold text-gray-800">
                                {report.reportType || "Medical Report"}
                            </h3>
                        </div>

                        <p className="text-sm text-gray-500 mb-2">
                            Uploaded on:{" "}
                            {new Date(report.uploadedAt).toLocaleDateString()}
                        </p>

                        <a
                            href={report.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                        >
                            <Eye size={16} className="inline mr-1" /> View File
                        </a>

                        <Link
                            href={`/dashboard/reports/${report._id}`}
                            className="block w-full text-center mt-2 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100"
                        >
                            <Brain size={16} className="inline mr-1" /> View AI Summary
                        </Link>

                    </div>
                ))}
            </div>
        </div>
    );
}
