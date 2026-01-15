import { configureStore } from "@reduxjs/toolkit";
import consultReducer from "./consultSlice";
import tabReducer from "./tabSlice";
import workReducer from "./workSlice";

export const store = configureStore({
  reducer: {
    work: workReducer,
    consult: consultReducer,
    tab: tabReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
