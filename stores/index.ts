import { configureStore } from "@reduxjs/toolkit";
import consultReducer from "./consultSlice";
import workReducer from "./workSlice";

export const store = configureStore({
  reducer: {
    work: workReducer,
    consult: consultReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
