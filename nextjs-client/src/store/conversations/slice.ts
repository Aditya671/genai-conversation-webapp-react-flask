import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Conversation {
    conversationId: string | number;
    conversationTitle: string;
    dateTimeCreated?: string;
    isNew?: boolean;
    isActive?: boolean;
    isPinned?: boolean;
    dateTimePinned?: string;
    userId?: string | number;
}

export interface ConversationsState {
    selectedConversation: Conversation;
    conversationsList: Conversation[];
    pinnedConversations: Conversation[];
}

const initialState: ConversationsState = {
    selectedConversation: { conversationId: 0, conversationTitle: '' },
    conversationsList: [],
    pinnedConversations: [],
};

export const conversationSlicer = createSlice({
    name: 'conversations',
    initialState,
    reducers: {
        setSelectedConversation: (state, action: PayloadAction<Conversation>) => {
            state.selectedConversation = action.payload;
        },
        setConversationsList: (state, action: PayloadAction<Conversation[]>) => {
            state.conversationsList = action.payload;
        },
        setPinnedConversation: (state, action: PayloadAction<Conversation[]>) => {
            state.pinnedConversations = action.payload;
        },
    },
});

export const {
    setSelectedConversation,
    setConversationsList,
    setPinnedConversation,
} = conversationSlicer.actions;

export default conversationSlicer.reducer;
