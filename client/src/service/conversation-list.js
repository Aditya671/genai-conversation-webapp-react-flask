import { conversationObjectUpdateTypes } from "../helper/constants"
import { Endpoints } from "../helper/endPoints"
import { setConversationsList } from "../store/conversations/slice"
import CustomAxios from "./axios-service"


export const getConversationsList =
    (userId = '') => (dispatch, getState)=>
{
    if(!userId){
        return 'Unauthorized User';
    }
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

export const updateConversationObject =
    (convId, convTitle, updateType = conversationObjectUpdateTypes['DEFAULT']) => (dispatch, getState) =>
{
    const userId = getState().users.userId
    let apiBody = { conversationTitle: convTitle }
    if(updateType === conversationObjectUpdateTypes['PIN']){
        apiBody = {isPinned: true}
    }
    if(updateType === conversationObjectUpdateTypes['DELETE']){
        apiBody = {isActive: false}
    }
    CustomAxios(
        Endpoints.conversations.replace(/userId/, userId).replace(/conversationId/, convId), 
        'PATCH', apiBody
    ).then((response) => {
        return true
    }
    ).catch((error) => {
        return console.log(error)
    }).finally(() => {
        return true
    })
}