import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: '67d1c4e768fd6d29d3043c98'
}

export const usersSlicer = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUserId: (state, action) => { state.userId = action.payload },
    },
});

export const {
    setUserId
} = usersSlicer.actions;

export default usersSlicer.reducer;
