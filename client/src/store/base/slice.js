import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isUserPromptFieldInActiveState: false,
    isSidebarCollapsed: false,
}

export const baseSlicer = createSlice({
    name: "base",
    initialState,
    reducers: {
        setUserPromptFieldActiveState: (state, action) => {
            state.isUserPromptFieldInActiveState = action.payload;
        },
        setSidebarCollapsedState: (state, action) => {
            state.isSidebarCollapsed = action.payload;
        }
    },
});

export const {
    setUserPromptFieldActiveState,
    setSidebarCollapsedState
} = baseSlicer.actions;

export default baseSlicer.reducer;
