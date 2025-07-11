import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { messageTypes, messageAvatarSrcDefault } from '../../helper/constants';
import type { UploadProps } from "antd";

export interface TableDataItem {
    [key: string]: unknown;
}
export interface ChartDataItem {
    [key: string]: unknown;
}
export interface MessageAdditionalInfo {
    tableData: TableDataItem[];
    chartData: ChartDataItem[];
    extra: Record<string, unknown>;
}

export interface Message {
    messageId?: string | number;
    conversationId?: string | number;
    messageType: string;
    messageAvatarSrc: string;
    messageDescription: string;
    messageSubDescription: string;
    messageAdditionalInfo: MessageAdditionalInfo;
    messageDateTimeCreated: string;
    uploadedFiles?: UploadProps[] | null;
    isEdited: boolean;
    isSaved: boolean;
    referenceMessageId: string | null;
}
export interface MessageWithConvId{
    conversationId: string | number; messages: Message[]
}

export interface MessagesState {
    introMessage: Message;
    messagesList: MessageWithConvId[];
    selectedConversationMessages: Message[];
    userPrompt: string | null;
}

const initialState: MessagesState = {
    introMessage: {
        messageId: 0,
        conversationId: 0,
        messageType: messageTypes['bot'],
        messageAvatarSrc: messageAvatarSrcDefault,
        messageDescription: 'This is a description',
        messageSubDescription: 'This is a sub description',
        messageAdditionalInfo: {
            tableData: [],
            chartData: [],
            extra: {},
        },
        messageDateTimeCreated : new Date().toISOString(),
        isEdited: false,
        isSaved: false,
        referenceMessageId: null
    },
    messagesList: [],
    selectedConversationMessages: [],
    userPrompt: '',
};

export const messageSlicer = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessagesList: (state: MessagesState, action: PayloadAction<MessageWithConvId[]>) => {
            state.messagesList = action.payload;
        },
        setSelectedMessagesList: (state, action: PayloadAction<Message[]>) => {
            state.selectedConversationMessages = action.payload;
        },
        setUserMessagesPrompt: (state, action: PayloadAction<string | null>) => {
            state.userPrompt = action.payload;
        },
    },
});

export const {
    setMessagesList,
    setSelectedMessagesList,
    setUserMessagesPrompt,
} = messageSlicer.actions;

export default messageSlicer.reducer;
