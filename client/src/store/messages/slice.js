import { createSlice } from "@reduxjs/toolkit";
import { messageAvatarSrcDefault, messageTypes } from "../../helper/constants";
import logo from '../../chatbot-preview.png';

const initialState = {
    selectedMessage: null,
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
    messagesList: [
        {
            messageId: 1,
            messageType:messageTypes['user'],
            messageAvatarSrc:messageAvatarSrcDefault,
            messageDescription:'This is a description',
            messageSubDescription:'This is a sub description',
            messageAdditionalInfo:{
                tableData:[],
                chartData:[],
                extra:{}
            },

        },
        {
            messageId: 2,
            messageType:messageTypes['bot'],
            messageAvatarSrc:logo,
            messageDescription:'How are you doing, all well?',
            messageSubDescription:'This is a sub description',
            messageAdditionalInfo:{
                tableData:[],
                chartData:[],
                extra:{}
            },

        },
        {
            messageId: 3,
            messageType:messageTypes['user'],
            messageAvatarSrc:messageAvatarSrcDefault,
            messageDescription:'Yes',
            messageSubDescription:'This is a sub description',
            messageAdditionalInfo:{
                tableData:[],
                chartData:[],
                extra:{}
            },
        }
    ],
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
