import { conversationObjectUpdateTypes } from "../helper/constants";
import { Endpoints } from "../helper/endPoints";
import {
  Conversation,
  setConversationsList,
} from "../store/conversations/slice";
import { customAxios } from "./axios-service";
import { Dispatch } from "redux";
import { UsersState } from "@/store/users/slice";

// export const getConversation = async (): Promise<Conversation[]> => {
//   const response = await customAxios<Conversation[]>({ url: '/conversations', method: 'get' });
//   return response.data;
// };

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
    updateType: string = conversationObjectUpdateTypes["DEFAULT"]
) => async (getState: () => UsersState) => {
    if (updateType === conversationObjectUpdateTypes["DEFAULT"]) {
        console.log("No update type provided");
        return;
    }
    const userId: UsersState | string = getState().userId || "";

    let apiBody: Record<string, string | boolean> = { conversationTitle: convTitle };
    if (updateType === conversationObjectUpdateTypes["PIN"]) {
        apiBody = { isPinned: true };
    }
    if (updateType === conversationObjectUpdateTypes["DELETE"]) {
        apiBody = { isActive: false };
    }
    try {
        await customAxios({
            url: Endpoints.conversations
                .replace(/userId/, String(userId))
                .replace(/conversationId/, convId),
            method: "post",
            body: apiBody,
        });
        return getConversationsList(String(userId))
    } catch (error) {
        console.log(error);
        return false;
    }
};
