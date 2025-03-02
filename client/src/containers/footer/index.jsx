import { useState } from "react";
import { cloneDeep, isArray, isEmpty} from 'lodash';
import { v4 } from "uuid";
import { Flex } from "antd"
import { useSelector, useDispatch } from 'react-redux';
import { GetInputField } from "../../components/InputField"
import { ButtonComponent } from "../../components/Button";
import { SendOutlinedSVG } from "../../assets/svg/SendOutlinedSVG";
import { errorModal } from "../../components/MessageModal";
import { messageAvatarSrcDefault, messageObject, messageTypes, newConversationObject } from "../../helper/constants";
import { setMessagesList, setSelectedMessagesList } from "../../store/messages/slice";
import { setConversationsList, setSelectedConversation } from "../../store/conversations/slice";



export const FoorterComponent = (props) => {
    const [userInput, setUserInput] = useState('')
    const messagesList = cloneDeep(useSelector((state) => state.messages.messagesList))
    const conversationsList = useSelector((state) => state.conversations.conversationsList)
    const selectedConversation = useSelector((state) => state.conversations.selectedConversation)
    const dispatch = useDispatch();
    const handleUserPrompt = (colomnName, row, rowIndex, promptMessage) => {
        setUserInput(promptMessage)
    }

    const handleSendPromptClick = () => {
        if(!userInput){
            return errorModal('User Prompt', 'Please enter prompt message')
        }
        
        let originalMessageList = cloneDeep(messagesList)
        const newMsgObj = cloneDeep(messageObject)
        newMsgObj['messageDescription'] = userInput
        newMsgObj['messageType'] = messageTypes['user']
        newMsgObj['messageId'] = v4()
        newMsgObj['messageAvatarSrc'] = messageAvatarSrcDefault
        let displayMessageContent = null
        let selectedConvMessagesList = {}
        if(selectedConversation && selectedConversation.conversationId){
            newMsgObj['conversationId'] = selectedConversation['conversationId']
            
            selectedConvMessagesList = cloneDeep(originalMessageList.find(msg => msg.conversationId === selectedConversation['conversationId'])) || {}
            if(!isEmpty(selectedConvMessagesList) && Object.keys(selectedConvMessagesList).includes('messages') && isArray(selectedConvMessagesList['messages'])){
                selectedConvMessagesList['messages'].push(newMsgObj)
            }else{
                selectedConvMessagesList['conversationId'] = selectedConversation['conversationId']
                selectedConvMessagesList['messages'] = [newMsgObj]
            }
            displayMessageContent = cloneDeep(selectedConvMessagesList['messages'])

            let convMessageIndex = originalMessageList.findIndex(msg => msg.conversationId === selectedConversation['conversationId'])
            if (convMessageIndex >= 0){ 
                delete originalMessageList[convMessageIndex]
                originalMessageList[convMessageIndex] = selectedConvMessagesList
            }else{
                originalMessageList.push(selectedConvMessagesList)
            }

        }
        if(Array.isArray(conversationsList) && conversationsList.length < 1){
            let conversationId = v4()
            const convCloned = cloneDeep(
                [...conversationsList, newConversationObject(conversationId, `Conv-${conversationId}`, false)]
            )
            dispatch(setConversationsList(convCloned))
            dispatch(setSelectedConversation(
                {conversationId: conversationId, conversationTitle:`Conv-${conversationId}`}
            ))

            newMsgObj['conversationId'] = conversationId
            originalMessageList = [{conversationId: conversationId, messages:[newMsgObj]}]
            displayMessageContent = [newMsgObj]
        }
        
        dispatch(setMessagesList([...originalMessageList]))
        dispatch(setSelectedMessagesList(displayMessageContent))
        return true
    }
    return (
        <>
            <Flex>
            <GetInputField maxLength={12000} inputType="textarea" colomnName="UserPrompt" onRowUpdate={handleUserPrompt}/>
            <ButtonComponent tooltipText='Send Prompt' themeType='IconButton' icon={<SendOutlinedSVG />}
                onClickHandle={handleSendPromptClick}
            />
            </Flex>
        </>
    )
}