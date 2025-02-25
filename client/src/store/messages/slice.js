import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedMessage: null,
    messagesList: [],
}

export const messageSlicer = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setSelectedMessage: (state, action) => state.selectedMessage = action.payload,
        setMessagesList: (state, action) => state.messagesList = action.payload,
    },
});

export const {
    setSelectedMessage,
    setMessagesList
} = messageSlicer.actions;

export default messageSlicer.reducer;
