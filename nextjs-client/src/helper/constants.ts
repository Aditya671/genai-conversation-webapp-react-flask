import { Conversation } from "@/store/conversations/slice";
import { Message } from "@/store/messages/slice";
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


const dateTime = new Date().toISOString()

export const newConversationObject = (
    convId = String(v4()),
    convTitle = `Conversation-${dateTime}`, isNew = true, userId = 0
) : Conversation => {
    return {
        conversationId: convId,
        conversationTitle: convTitle,
        selectedModel: '',
        dateTimeCreated: dateTime,
        isNew : isNew,
        isActive: true,
        isPinned: false,
        isArchieved: false,
        dateTimePinned: '',
        userId: userId,
    }
}
export const messageObject : Message = {
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
    messageDateTimeCreated: new Date().toISOString(),
    uploadedFiles: [],
    isEdited : false,
    isSaved: false,
    referenceMessageId: null
}

export const createNewMessage = (prompt : string, convId? : string | number) => {
    return {
        ...messageObject,
        conversationId: convId,
        messageDescription: prompt,
        messageSubDescription: String(new Date().toUTCString()),
        messageType: messageTypes.user,
        messageId: v4(),
        messageAvatarSrc: messageAvatarSrcDefault,
    };
};

export const conversationObjectUpdateTypes = {
    'TITLE': 'TITLE',
    'EXPORT': 'EXPORT',
    'PIN': 'PIN',
    'DELETE': 'DELETE',
    'DEFAULT': 'DEFAULT',
    'MODEL_CHANGE': 'MODEL_CHANGE'
}