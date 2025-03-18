import { Endpoints } from "../helper/endPoints"
import { setConversationsList } from "../store/conversations/slice"
import CustomAxios from "./axios-service"


export const getConversationsList =
    (userId = '67d1c4e768fd6d29d3043c98') => (dispatch, getState)=>
{
    // const userId = getState().users.userId
    CustomAxios(
        Endpoints.getConversations.replace(/userId/, userId), 'GET'
    ).then((response) => {
        return dispatch(setConversationsList(response.data))
    }
    ).catch((error) => {
        return console.log(error)
    }).finally(() => {
        return true
    })
}

export const updateConversationTitle =
    (convId, convTitle) => (dispatch, getState) =>
{
    const userId = getState().users.userId
    CustomAxios(
        Endpoints.conversations.replace(/userId/, userId).replace(/conversationId/, convId), 
        'PATCH', { conversationTitle: convTitle }
    ).then((response) => {
        return true
    }
    ).catch((error) => {
        return console.log(error)
    }).finally(() => {
        return true
    })
}