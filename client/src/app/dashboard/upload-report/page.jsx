'use client';

import { useState } from 'react';
import { API_URL } from '@/constants/api';

export default function UploadReport() {
    const [file, setFile] = useState(null);
    const [reportType, setReportType] = useState('General Report');
    const [uploadedFileId, setUploadedFileId] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) return alert('Please select a file');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('reportType', reportType);

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/file/upload`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                alert('✅ File Uploaded Successfully');
                setUploadedFileId(data.file._id);
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (err) {
            alert('Upload Failed');
        }

        setLoading(false);
    };

    const handleAIProcess = async () => {
        if (!uploadedFileId) return alert("Upload file first!");

        setLoading(true);

        const response = await fetch(`${API_URL}/ai/process-file`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ fileId: uploadedFileId })
        });

        const data = await response.json();
        alert("✅ AI Analysis Completed");

        setLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload Medical Report</h2>

            <div className="mb-4">
                <label className="font-medium text-gray-700">Report Type</label>
                <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full mt-2 border p-2 rounded"
                >
                    <option>General Report</option>
                    <option>Blood Test</option>
                    <option>X-Ray</option>
                    <option>MRI</option>
                    <option>CT Scan</option>
                </select>
            </div>

            <div className="border-dashed border-2 p-6 text-center rounded-lg cursor-pointer mb-4">
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <p className="text-gray-500 text-sm mt-2">Upload PDF, JPG, PNG</p>
            </div>

            <button
                onClick={handleUpload}
                className="bg-blue-600 w-full text-white py-2 rounded hover:bg-blue-700"
                disabled={loading}
            >
                {loading ? 'Uploading...' : 'Upload Report'}
            </button>

            {uploadedFileId && (
                <button
                    onClick={handleAIProcess}
                    className="bg-green-600 w-full text-white py-2 rounded hover:bg-green-700 mt-3"
                >
                    Process with AI
                </button>
            )}
        </div>
    );
}
