"use client";
import { useGetTimelineQuery } from "@/redux/services/timelineApi";
import { Activity } from "lucide-react";

export default function TimelinePage() {
  const { data, isLoading } = useGetTimelineQuery();

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Activity size={20} /> Activity Timeline
      </h2>

      <div className="border-l-2 border-gray-300 pl-6 space-y-5">
        {data?.map((item, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-3 w-3 h-3 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-gray-500">{new Date(item.date).toLocaleString()}</p>
            <p className="text-gray-800 font-medium">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
