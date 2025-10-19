import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/constants/api";

export const timelineApi = createApi({
  reducerPath: "timelineApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/timeline`, credentials: "include" }),
  endpoints: (builder) => ({
    getTimeline: builder.query({
      query: () => "/",
    }),
  }),
});

export const { useGetTimelineQuery } = timelineApi;
