"use client";

export default function StatCard({ title, value, icon, description }) {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-baseline justify-between">
          <h4 className="text-sm font-medium text-gray-600">{title}</h4>
          <div className="text-2xl font-semibold text-gray-800">{value}</div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );
}
