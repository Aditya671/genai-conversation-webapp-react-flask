import { Conversation } from "@/store/conversations/slice";
import { MessageWithConvId } from "@/store/messages/slice";

export const prepareConversationData = (
  conversationsList: Conversation[],
  messagesList: MessageWithConvId[]
): unknown[] => {
  if (!Array.isArray(conversationsList) || !Array.isArray(messagesList)) {
    return [];
  }
  return conversationsList.map((conversation: Conversation) => {
    const conversationMessages = messagesList.find(
      (msg: MessageWithConvId) => msg.conversationId === conversation.conversationId
    ) || { messages: [] };
    return {
      ...conversation,
      messages: conversationMessages.messages,
    };
  });
};
