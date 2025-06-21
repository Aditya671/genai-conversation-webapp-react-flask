
export const prepareConversationData = (conversationsList, messagesList) => {
    if (!Array.isArray(conversationsList) || !Array.isArray(messagesList)) {
        return [];
    }

    return conversationsList.map((conversation) => {
        const conversationMessages = messagesList.find(
            (msg) => msg.conversationId === conversation.conversationId
        ) || { messages: [] };

        return {
            ...conversation,
            messages: conversationMessages.messages,
        };
    });
}