import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isUserPromptFieldActiveState: false
}

export const baseSlicer = createSlice({
    name: "base",
    initialState,
    reducers: {
        setUserPromptFieldActiveState: (state, action) => {
            state.isUserPromptFieldActiveState = action.payload;
        }
    },
});

export const {
    setUserPromptFieldActiveState,
} = baseSlicer.actions;

export default baseSlicer.reducer;
