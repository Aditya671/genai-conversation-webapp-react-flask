import { cloneDeep } from "lodash";
import { AxiosResponse } from "axios";
import { Endpoints } from "../helper/endPoints";
import { setMessagesList, Message, MessageWithConvId } from "../store/messages/slice";
import { customAxios } from "./axios-service";
import { Dispatch } from "redux";
import type { RootState } from "../store/store";


export const getMessagesList = async (
    conversationId: string
): Promise<Message[]> => {
    const response: AxiosResponse<Message[]> = await customAxios({
        url: `/conversations/${conversationId}/messages`,
        method: "get",
    });
    return response.data;
};

export const getSelectedConvMessages =
    (conversationId = "") =>
    async (dispatch: Dispatch, getState: () => RootState) =>
{
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
            { conversationId, messages: response.data }
          ])
        );
      }
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
};

export const postUserPrompt =
  () => async (dispatch: Dispatch, getState: () => RootState) => {
    const userId = getState().users.userId;
    const messagesList: Message[] = cloneDeep(
      getState().messages.selectedConversationMessages
    );
    const conversationId =
      getState().conversations.selectedConversation.conversationId;
    if (messagesList.length === 0) {
      return "No messages to send";
    }
    const postMessage = messagesList.map((msg) => msg.messageDescription);
    try {
      const response = await customAxios<string[]>({
        url: Endpoints.postUserPrompt
          .replace(/userId/, userId)
          .replace(/conversationId/, String(conversationId)),
        method: "post",
        body: postMessage,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
