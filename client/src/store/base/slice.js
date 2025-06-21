import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isUserPromptFieldInActiveState: false
}

export const baseSlicer = createSlice({
    name: "base",
    initialState,
    reducers: {
        setUserPromptFieldActiveState: (state, action) => {
            state.isUserPromptFieldInActiveState = action.payload;
        }
    },
});

export const {
    setUserPromptFieldActiveState,
} = baseSlicer.actions;

export default baseSlicer.reducer;
