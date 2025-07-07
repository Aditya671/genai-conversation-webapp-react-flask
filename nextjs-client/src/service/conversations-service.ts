import { conversationObjectUpdateTypes } from "../helper/constants";
import { Endpoints } from "../helper/endPoints";
import {
  Conversation,
  setConversationsList,
} from "../store/conversations/slice";
import { customAxios } from "./axios-service";
import { Dispatch } from "redux";


export const getConversationsList = (
    userId: string = ''
) => async (dispatch: Dispatch) => {
    if (!userId) {
        return "Unauthorized User";
    }
    try {
        const response = await customAxios<Conversation[]>({
            url: Endpoints.getConversations.replace(/userId/, userId),
            method: "get",
        });
        dispatch(setConversationsList(response.data));
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const updateConversationObject = (
    convId: string,
    convTitle: string,
    updateType: string = conversationObjectUpdateTypes["DEFAULT"],
    userId: string = 'local_user'
) => async (dispatch: Dispatch) => {
    if (updateType === conversationObjectUpdateTypes["DEFAULT"]) {
        console.log("No update type provided");
        return;
    }
    let apiBody: Record<string, string | boolean> = { conversationTitle: convTitle };
    if (updateType === conversationObjectUpdateTypes["PIN"]) {
        apiBody = { isPinned: true };
    }
    if (updateType === conversationObjectUpdateTypes["DELETE"]) {
        apiBody = { isActive: false };
    }
    if (updateType === conversationObjectUpdateTypes["MODEL_CHANGE"]) {
        apiBody = { selectedModel: convTitle };
    }
    try {
        const response = await customAxios({
            url: Endpoints.conversations
                .replace(/userId/, String(userId))
                .replace(/conversationId/, convId),
            method: "patch",
            data: apiBody,
        });
        if(response){
            return dispatch(getConversationsList(String(userId)))
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};
