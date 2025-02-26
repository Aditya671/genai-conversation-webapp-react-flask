import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedConversation: null,
    conversationsList: [],
    pinnedConversations: [],
}

export const conversationSlicer = createSlice({
    name: "conversations",
    initialState,
    reducers: {setSelectedConversation: (state, action) => {
        state.selectedConversation = action.payload;
    },
      setConversationsList: (state, action) => {
        state.conversationsList = action.payload;
    },
      setPinnedConversation: (state, action) => {
        state.pinnedConversations = action.payload;
    },
    },
});

export const {
    setSelectedConversation,
    setConversationsList,
    setPinnedConversation
} = conversationSlicer.actions;

export default conversationSlicer.reducer;
