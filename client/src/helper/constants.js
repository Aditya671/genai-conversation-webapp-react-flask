import { v4 } from "uuid";

// API Error Message to show if an error occurs (any type erro)
export const errorMessage = "Something went wrong. Please try again later";
// Success Message
export const successMessage = "Api call completed";
// API Endpoint failure Message
export const apiNotWorkingMessage = 'Api seems to be not responding, Please Contact the Administrator'

// Ongoing Month Number (Integer Whole-Number)
export const currentMonthNumber = Number(new Date().getMonth()) === 0 ? 1 : Number(new Date().getMonth() + 1)
export const currentYear = Number(new Date().getFullYear())
export const messageTypes = {
    'user':'User',
    'bot': 'Bot',
    'model': 'Model'
}
export const messageAvatarSrcDefault = 'https://api.dicebear.com/7.x/miniavs/svg?seed=8'
export const messageObject = {
    messageId: 0,
    conversationId: 0,
    messageType:'',
    messageAvatarSrc: '',
    messageDescription:'',
    messageSubDescription:'',
    messageAdditionalInfo:{
        tableData:[],
        chartData:[],
        extra:{}
    },
}
const dateTime = new Date().toISOString()

export const newConversationObject = (
    convId = v4(), convTitle = `Conversation-${dateTime}`, isNew = true, userId = 0) => {
    return {
    conversationId: convId,
    conversationTitle: convTitle,
    dateTimeCreated: dateTime,
    isNew : isNew,
    isActive: true,
    isPinned: false,
    dateTimePinned: '',
    userId: userId,
}}