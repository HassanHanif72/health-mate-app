import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { timelineApi } from "./services/timelineApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [timelineApi.reducerPath]: timelineApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, timelineApi.middleware),
});

