import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DoctorNewJob } from "@/types/newJobModel";

/* ---------- Types ---------- */

export interface ConsultState {
  consult_id: string | null;
  info: DoctorNewJob | null;
}

/* ---------- Initial State ---------- */

const initialState: ConsultState = {
  consult_id: null,
  info: null,
};

/* ---------- AsyncStorage Keys ---------- */

const CONSULT_STORAGE_KEY = "app-consult";

/* ---------- Thunks ---------- */

// load consult from AsyncStorage
export const loadConsult = createAsyncThunk("consult/load", async () => {
  const data = await AsyncStorage.getItem(CONSULT_STORAGE_KEY);
  if (data) {
    return JSON.parse(data) as ConsultState;
  }
  return initialState;
});

// save consult to AsyncStorage
export const saveConsult = createAsyncThunk(
  "consult/save",
  async (state: ConsultState) => {
    await AsyncStorage.setItem(CONSULT_STORAGE_KEY, JSON.stringify(state));
    return state;
  }
);

// clear consult
export const clearConsult = createAsyncThunk("consult/clear", async () => {
  await AsyncStorage.removeItem(CONSULT_STORAGE_KEY);
  return initialState;
});

/* ---------- Slice ---------- */

const consultSlice = createSlice({
  name: "consult",
  initialState,
  reducers: {
    setConsultId(state, action: PayloadAction<string | null>) {
      state.consult_id = action.payload;
    },
    setConsultInfo(state, action: PayloadAction<DoctorNewJob | null>) {
      state.info = action.payload;
    },
    resetConsult() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadConsult.fulfilled, (_, action) => {
        return action.payload;
      })
      .addCase(saveConsult.fulfilled, (_, action) => {
        return action.payload;
      })
      .addCase(clearConsult.fulfilled, () => {
        return initialState;
      });
  },
});

/* ---------- Exports ---------- */

export const { setConsultId, setConsultInfo, resetConsult } =
  consultSlice.actions;

export default consultSlice.reducer;
