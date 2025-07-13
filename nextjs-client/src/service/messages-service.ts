import { cloneDeep } from "lodash";
import { Endpoints } from "../helper/endPoints";
import {
  setMessagesList,
  Message,
  MessageWithConvId,
  setSelectedMessagesList,
} from "../store/messages/slice";
import { customAxios } from "./axios-service";
import type { AppDispatch, RootState } from "../store/store";
import { isKeyInObject } from "@/utility/utility";
import { RcFile } from "antd/es/upload";
import { v4 as uuidv4 } from "uuid";

export const getMessagesList =(
    conversationId: string, isRefreshed: boolean = false
) => async (dispatch: AppDispatch, getState: () => RootState)=> {
    const response = await customAxios<MessageWithConvId[]>({
        url: `/conversations/${conversationId}/messages`,
        method: "get",
    });
    const messagesListClone = cloneDeep(getState().messages.messagesList);
    if (response.data.length > 0) {
        if (isRefreshed === true) {
            const convMessageIndex = messagesListClone.findIndex(
                (msg) => msg.conversationId === conversationId
            );
            if (convMessageIndex === -1) {
                messagesListClone.push(response.data[0]);
            } else {
                messagesListClone[convMessageIndex] = response.data[0];
            }
            dispatch(setMessagesList([...messagesListClone]));
        } else {
            dispatch(setMessagesList([...messagesListClone, response.data[0]]));
        }
    }
    if ( Array.isArray(response.data) && isKeyInObject(response.data, "messages")) {
        dispatch(setSelectedMessagesList(response.data[0]["messages"]));
    }
    if (Array.isArray(response.data) && response.data.length === 0) {
        dispatch(setSelectedMessagesList([]));
    }
    return true;
};

export const getSelectedConvMessages = (
    conversationId = ""
) => async (dispatch: AppDispatch, getState: () => RootState) => {
    const userId = getState().users.userId;
    const messagesList: MessageWithConvId[] = cloneDeep(getState().messages.messagesList);
    try {
        const response = await customAxios<Message[]>({
            url: Endpoints.getMessages
                .replace(/userId/, userId)
                .replace(/conversationId/, conversationId),
            method: "get",
        });
        const convMessage = messagesList.find(
            (msg: MessageWithConvId) => msg.conversationId === conversationId
        );
        if (conversationId && !convMessage) {
            dispatch(
                setMessagesList([
                    ...messagesList,
                { conversationId, messages: response.data },
            ])
            );
        }
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const postUserPrompt =(
    messageObject: Message
) => async (dispatch: AppDispatch, getState: () => RootState) => {
    const userId = getState().users.userId;
    const conversationId = getState().conversations.selectedConversation.conversationId;
    try {
        const response = await customAxios<string[]>({
            url: Endpoints.postUserPrompt
                .replace(/userId/, userId)
                .replace(/conversationId/, String(conversationId)),
            method: "put",
            body: messageObject,
        });
        if (response.data) {
            dispatch(getMessagesList(String(conversationId), true));
        }
        return true;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const uploadFilesThunk = (
    uploadedFiles: RcFile[]
) =>async (dispatch: AppDispatch, getState: () => RootState) => {
    const userId = getState().users.userId;
    const conversationId = getState().conversations.selectedConversation.conversationId;
    const selectedConversationMessages = getState().messages.selectedConversationMessages;
    const messageId = selectedConversationMessages.findLast(m => m)?.messageId || uuidv4()
    const formData = new FormData();
    uploadedFiles.forEach((file) => {
        formData.append("upload_files", file);
    });

    try {
        const response = await customAxios({
            url: Endpoints.uploadFileAPI
                .replace(/userId/, userId)
                .replace(/conversationId/, String(conversationId))
                .replace(/messageId/, String(messageId)),
            method: "patch",
            config: {
                headers: { "Content-Type": "multipart/form-data" },
            },
            data: formData,
        });

        if (response.data) {
            console.log("Files uploaded:", response.data);
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("File upload error:", error);
        return null;
    }
};
