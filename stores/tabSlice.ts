import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TabName = "homeScreen" | "historyScreen" | "settingScreen";

type TabState = {
    activeTab: TabName;
};

const initialState: TabState = {
    activeTab: "homeScreen",
};

const tabSlice = createSlice({
    name: "tab",
    initialState,
    reducers: {
        setActiveTab(state, action: PayloadAction<TabName>) {
            state.activeTab = action.payload;
        },
    },
});

export const { setActiveTab } = tabSlice.actions;
export default tabSlice.reducer;
