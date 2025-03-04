import { createSlice } from "@reduxjs/toolkit";
import { messageAvatarSrcDefault, messageTypes } from "../../helper/constants";
import logo from '../../chatbot-preview.png';

const initialState = {
    introMessage:{
        messageId: 0,
        messageType:messageTypes['bot'],
        messageAvatarSrc: logo,
        messageDescription:'This is a description',
        messageSubDescription:'This is a sub description',
        messageAdditionalInfo:{
            tableData:[],
            chartData:[],
            extra:{}
        },
    },
    messagesList: [],
    selectedConversationMessages: []
}

export const messageSlicer = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setMessagesList: (state, action) => { state.messagesList = action.payload },
        setSelectedMessagesList: (state, action) => { state.selectedConversationMessages = action.payload },
    },
});

export const {
    setMessagesList,
    setSelectedMessagesList
} = messageSlicer.actions;

export default messageSlicer.reducer;
