import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SidebarExpandedState } from "../types";

const initialState: SidebarExpandedState = {
    isExpanded: true
};

const sidebarExpandedSlice = createSlice({
    name: "sidebarExpanded",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isExpanded = !state.isExpanded;
        },
        setSidebarState: (state, action: PayloadAction<boolean>) => {
            state.isExpanded = action.payload;
        }
    }
});

export const { toggleSidebar, setSidebarState } = sidebarExpandedSlice.actions;
export default sidebarExpandedSlice.reducer;