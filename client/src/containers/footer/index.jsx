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
import { setMessagesList, setSelectedMessagesList, setUserMessagesPrompt } from "../../store/messages/slice";
import { setConversationsList, setSelectedConversation } from "../../store/conversations/slice";

export const FoorterComponent = (props) => {
    // const [userInput, setUserInput] = useState('')
    const messagesList = cloneDeep(useSelector((state) => state.messages.messagesList))
    const userPrompt = cloneDeep(useSelector((state) => state.messages.userPrompt))
    const conversationsList = useSelector((state) => state.conversations.conversationsList)
    const selectedConversation = useSelector((state) => state.conversations.selectedConversation)
    const dispatch = useDispatch();
    const handleUserPrompt = (colomnName, row, rowIndex, promptMessage) => {
        dispatch(setUserMessagesPrompt(promptMessage))
    }

    const handleSendPromptClick = () => {
        if(!userPrompt){
            return errorModal('User Prompt', 'Please enter prompt message')
        }
        
        let originalMessageList = cloneDeep(messagesList)
        const newMsgObj = cloneDeep(messageObject)
        newMsgObj['messageDescription'] = userPrompt
        newMsgObj['messageSubDescription'] = String(new Date().toUTCString())
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
            let convIndexToUpdate = conversationsList.findIndex(conv => conv.conversationId === selectedConversation['conversationId'])
            if(
                convIndexToUpdate >= 0 &&
                Object.keys(conversationsList[convIndexToUpdate]).includes('isNew') && 
                conversationsList[convIndexToUpdate]['isNew'] === true
            ){
                let originalConvCloned = cloneDeep(conversationsList)
                let convCloned = cloneDeep(originalConvCloned[convIndexToUpdate])
                delete originalConvCloned[convIndexToUpdate]
                convCloned['isNew'] = false
                originalConvCloned[convIndexToUpdate] = convCloned
                dispatch(setConversationsList(originalConvCloned))
            }
        }
        if(Array.isArray(conversationsList) && conversationsList.length < 1){
            let conversationId = v4()
            const convCloned = cloneDeep(
                [...conversationsList, newConversationObject(conversationId, `Conversation-${new Date().toISOString()}`, false)]
            )
            dispatch(setConversationsList(convCloned))
            dispatch(setSelectedConversation(
                {conversationId: conversationId, conversationTitle:`Convesation-${new Date().toISOString()}`}
            ))

            newMsgObj['conversationId'] = conversationId
            originalMessageList = [{conversationId: conversationId, messages:[newMsgObj]}]
            displayMessageContent = [newMsgObj]
        }
        dispatch(setMessagesList([...originalMessageList]))
        dispatch(setSelectedMessagesList(displayMessageContent))
        dispatch(setUserMessagesPrompt(''))
        return true
    }
    const handleKeyDown = (event) => {
        if ((event.shiftKey && event.key === "Enter") || (event.ctrlKey && event.key === "Enter")) {
            event.preventDefault(); // Prevent the default behavior of adding a new line
            return handleSendPromptClick(); // Trigger your button click event
        }
    };

    return (
        <>
            <Flex style={{background:'#fff', borderRight:'3.5px'}}>
            <GetInputField maxLength={12000} inputType="textarea" colomnName="UserPrompt"
                onRowUpdate={handleUserPrompt}
                userValue={userPrompt}
                style={{background:'transparent', border:'none'}}
                onKeyDown={handleKeyDown}/>
            <ButtonComponent tooltipText='Send Prompt' themeType='IconButton' icon={<SendOutlinedSVG />}
                onClickHandle={handleSendPromptClick}
                style={{background:'transparent', border:'none'}}
            />
            </Flex>
        </>
    )
}