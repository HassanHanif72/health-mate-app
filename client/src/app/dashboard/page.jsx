"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/constants/api";
import StatCard from "@/components/ui/StatCard";
import { FileText, Activity, Cpu, Clock } from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    reportsCount: 0,
    vitalsCount: 0,
    insightsCount: 0,
    lastReportAt: null,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // 1) Get user data
        const userRes = await fetch(`${API_URL}/user/user-data`, {
          credentials: "include",
        });
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const userData = await userRes.json();
        setUser(userData);

        // 2) Try to fetch files list (if route exists)
        let reports = [];
        try {
          const filesRes = await fetch(`${API_URL}/file/list`, {
            credentials: "include",
          });
          if (filesRes.ok) {
            reports = await filesRes.json();
          } else {
            // fallback: try public route (if any) or empty
            reports = [];
          }
        } catch (e) {
          reports = [];
        }

        // 3) Try to fetch ai insights list (if route exists)
        let insights = [];
        try {
          const insightsRes = await fetch(`${API_URL}/ai/list`, {
            credentials: "include",
          });
          if (insightsRes.ok) {
            insights = await insightsRes.json();
          } else {
            insights = [];
          }
        } catch (e) {
          insights = [];
        }

        // 4) Try to fetch vitals list (if route exists)
        let vitals = [];
        try {
          const vitalsRes = await fetch(`${API_URL}/vitals/my-vitals`, {
            credentials: "include",
          });
          if (vitalsRes.ok) {
            vitals = await vitalsRes.json();
          } else {
            vitals = [];
          }
        } catch (e) {
          vitals = [];
        }

        // compute stats safely
        const reportsCount = Array.isArray(reports) ? reports.length : 0;
        const vitalsCount = Array.isArray(vitals) ? vitals.length : 0;
        const insightsCount = Array.isArray(insights) ? insights.length : 0;
        const lastReportAt = reportsCount
          ? reports[0]?.uploadedAt || reports[reportsCount - 1]?.uploadedAt
          : null;

        setStats({
          reportsCount,
          vitalsCount,
          insightsCount,
          lastReportAt,
        });
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Welcome{user?.firstName ? `, ${user.firstName}` : ""}</h2>
        <p className="text-sm text-gray-500 mt-1">Overview of your reports, vitals and AI insights.</p>
      </div>

      {loading ? (
        <div className="rounded-md bg-white p-8 shadow-sm">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 text-red-700">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Reports"
              value={stats.reportsCount}
              icon={<FileText size={20} />}
              description={stats.lastReportAt ? `Last: ${new Date(stats.lastReportAt).toLocaleDateString()}` : "No reports yet"}
            />
            <StatCard
              title="Vitals"
              value={stats.vitalsCount}
              icon={<Activity size={20} />}
              description="BP / Sugar / Weight entries"
            />
            <StatCard
              title="AI Insights"
              value={stats.insightsCount}
              icon={<Cpu size={20} />}
              description="Summaries & suggestions"
            />
            <StatCard
              title="Recent Activity"
              value={stats.reportsCount + stats.vitalsCount}
              icon={<Clock size={20} />}
              description="Combined events"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-md shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Recent Reports</h3>

              {stats.reportsCount === 0 ? (
                <p className="text-sm text-gray-500">No reports uploaded yet. Use Upload Report to add your first report.</p>
              ) : (
                <ul className="space-y-3">
                  {Array.isArray(stats.reports) && stats.reports.slice(0, 3).map((report) => (
                    <li
                      key={report._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md"
                    >
                      <div className="mb-2 sm:mb-0">
                        <div className="font-medium text-gray-700">{report.fileName}</div>
                        <div className="text-sm text-gray-500">
                          Uploaded {new Date(report.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <a
                        href={`/dashboard/reports/${report._id}`}
                        className="text-sm text-indigo-600 font-medium hover:underline"
                      >
                        View
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-md shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                <a
                  href="/dashboard/upload-report"
                  className="block w-full text-center py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
                >
                  Upload Report
                </a>
                <a
                  href="/dashboard/reports"
                  className="block w-full text-center py-2 rounded-md border border-blue-100 text-blue-600 font-medium hover:bg-blue-50"
                >
                  View Reports
                </a>
                <a
                  href="/dashboard/vitals"
                  className="block w-full text-center py-2 rounded-md border border-gray-100 text-gray-700 font-medium hover:bg-gray-50"
                >
                  Add Vitals
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
