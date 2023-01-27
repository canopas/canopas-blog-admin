import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./features/postSlice";

export default configureStore({
  reducer: {
    post: postReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
