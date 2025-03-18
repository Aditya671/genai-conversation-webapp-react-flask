import { cloneDeep } from "lodash"
import { Endpoints } from "../helper/endPoints"
import { setMessagesList } from "../store/messages/slice"
import CustomAxios from "./axios-service"

export const getSelectedConvMessages =
    (conversationId = '') => (dispatch, getState) =>
{
    const userId = getState().users.userId
    const messagesList = cloneDeep(getState().messages.messagesList)
    
    CustomAxios(
        Endpoints.getMessages
            .replace(/userId/, userId)
            .replace(/conversationId/, conversationId),
        'GET')
    .then((response) => {
        const convMessage = messagesList.find(msg => msg.conversationId === conversationId)
        if (conversationId && !convMessage) {
            return dispatch(
                setMessagesList(
                    [...messagesList, {conversationId: conversationId, messages: response.data}]
                )
            )
        }
    }
    ).catch((error) => {
        return console.log(error)
    }).finally(() => {
        return true
    })
}