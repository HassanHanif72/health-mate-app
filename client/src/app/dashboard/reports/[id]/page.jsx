"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/constants/api";
import { useParams } from "next/navigation";

export default function ReportInsightsPage() {
    const { id } = useParams();
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadInsights() {
            const res = await fetch(`${API_URL}/ai/insights/${id}`, { credentials: "include" });
            const data = await res.json();
            setInsight(data);
            setLoading(false);
        }
        loadInsights();
    }, [id]);

    if (loading) return <p className="p-6">Loading...</p>;
    if (!insight) return <p className="p-6">No AI report found</p>;

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">AI Medical Summary</h2>

            <section>
                <h3 className="text-lg font-semibold text-gray-700">📝 English Summary</h3>
                <p className="text-gray-600 mt-1">{insight.summaryEnglish}</p>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-gray-700">🇵🇰 Roman Urdu Summary</h3>
                <p className="text-gray-600 mt-1">{insight.summaryUrdu}</p>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-gray-700">❓ Questions for Doctor</h3>
                <ul className="list-disc ml-6 text-gray-600">
                    {(insight.doctorQuestions || []).map((q, i) => <li key={i}>{q}</li>)}
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-gray-700">🥗 Food Tips</h3>
                <ul className="list-disc ml-6 text-gray-600">
                    {(insight.foodTips || []).map((t, i) => <li key={i}>{t}</li>)}
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-gray-700">🌿 Home Remedies</h3>
                <ul className="list-disc ml-6 text-gray-600">
                    {(insight.homeRemedies || []).map((h, i) => <li key={i}>{h}</li>)}
                </ul>
            </section>
        </div>
    );
}
