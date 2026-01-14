import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WorkState {
  status: "end_work" | "start_work" | "paused_work";
  startWork: string;
  times: string;
}

/* ---------- Thunks ---------- */

export const resetWork = createAsyncThunk(
  "work/resetWork",
  async (_, { dispatch }) => {
    await AsyncStorage.multiRemove(["start_work", "times_work", "paused_work"]);
    dispatch(setStatus("end_work"));
    dispatch(setStartWork(""));
    dispatch(setTimesWork(""));

  }
);

export const paused_work = createAsyncThunk(
  "work/pausedWork",
  async (_, { dispatch }) => {
    await AsyncStorage.setItem("paused_work", "true");
    dispatch(setStatus("paused_work"));
  }
);

export const resume_work = createAsyncThunk(
  "work/resumeWork",
  async (_, { dispatch }) => {
    await AsyncStorage.removeItem("paused_work");
    dispatch(setStatus("start_work"));
  }
);

/* ---------- Slice ---------- */

const initialState: WorkState = {
  status: "end_work",
  startWork: "",
  times: "",
};

const workSlice = createSlice({
  name: "work",
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<WorkState["status"]>) => {
      state.status = action.payload;

    },
    setStartWork: (state, action: PayloadAction<string>) => {
      state.startWork = action.payload;
    },
    setTimesWork: (state, action: PayloadAction<string>) => {
      state.times = action.payload;
    },
  },
});

export const { setStatus, setStartWork, setTimesWork } = workSlice.actions;
export default workSlice.reducer;
