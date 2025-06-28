export const prepareConversationData = (
  conversationsList: unknown[],
  messagesList: unknown[]
): unknown[] => {
  if (!Array.isArray(conversationsList) || !Array.isArray(messagesList)) {
    return [];
  }
  return conversationsList.map((conversation: unknown) => {
    const conversationMessages = messagesList.find(
      (msg: unknown) => msg.conversationId === conversation.conversationId
    ) || { messages: [] };
    return {
      ...conversation,
      messages: conversationMessages.messages,
    };
  });
};
