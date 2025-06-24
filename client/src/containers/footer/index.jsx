import { cloneDeep, isArray, isEmpty } from 'lodash';
import { v4 } from "uuid";
import { Flex } from "antd"
import { useSelector, useDispatch } from 'react-redux';
import { GetInputField } from "../../components/InputField"
import { ButtonComponent } from "../../components/Button";
import { SendOutlinedSVG } from "../../assets/svg/SendOutlinedSVG";
import { errorModal } from "../../components/MessageModal";
import { createNewMessage, newConversationObject } from "../../helper/constants";
import { setMessagesList, setSelectedMessagesList, setUserMessagesPrompt } from "../../store/messages/slice";
import { setConversationsList, setSelectedConversation } from "../../store/conversations/slice";
import { setUserPromptFieldActiveState } from '../../store/base/slice';
import { postUserPrompt } from '../../service/messages-list';
import { ClipFilledSVG } from '../../assets/svg/ClipFilledSVG';
import { VoiceTypingFilledSVG } from '../../assets/svg/VoiceTypingFilledSVG';
import { useSpeechRecognizer } from '../../hooks/useSpeechRecognizer';
import { useState } from 'react';

export const FooterComponent = (props) => {
    const [isClicked, setIsClicked] = useState(false);
    
    const messagesList = cloneDeep(useSelector((state) => state.messages.messagesList))
    const userPrompt = cloneDeep(useSelector((state) => state.messages.userPrompt))
    const conversationsList = useSelector((state) => state.conversations.conversationsList)
    const selectedConversation = useSelector((state) => state.conversations.selectedConversation)
    const dispatch = useDispatch();
    
    const { isListening, startRecognition, stopRecognition } = useSpeechRecognizer();
    
    const handleUserPrompt = (colomnName, row, rowIndex, promptMessage) => {
        dispatch(setUserMessagesPrompt(promptMessage))
        if (!promptMessage) {
            return dispatch(setUserPromptFieldActiveState(true))
        }
        return dispatch(setUserPromptFieldActiveState(false))
    }

    const handleSendPromptClick = () => {
        if (!userPrompt) {
            return errorModal('User Prompt', 'Please enter prompt message')
        }

        let originalMessageList = cloneDeep(messagesList)
        const newMsgObj = createNewMessage(userPrompt)
        let displayMessageContent = null
        let selectedConvMessagesList = {}

        if (selectedConversation && selectedConversation.conversationId) {
            newMsgObj['conversationId'] = selectedConversation['conversationId']

            selectedConvMessagesList = cloneDeep(originalMessageList.find(msg => msg.conversationId === selectedConversation['conversationId'])) || {}
            if (!isEmpty(selectedConvMessagesList) && Object.keys(selectedConvMessagesList).includes('messages') && isArray(selectedConvMessagesList['messages'])) {
                selectedConvMessagesList['messages'].push(newMsgObj)
            } else {
                selectedConvMessagesList['conversationId'] = selectedConversation['conversationId']
                selectedConvMessagesList['messages'] = [newMsgObj]
            }
            displayMessageContent = cloneDeep(selectedConvMessagesList['messages'])

            let convMessageIndex = originalMessageList.findIndex(msg => msg.conversationId === selectedConversation['conversationId'])
            if (convMessageIndex >= 0) {
                delete originalMessageList[convMessageIndex]
                originalMessageList[convMessageIndex] = selectedConvMessagesList
            } else {
                originalMessageList.push(selectedConvMessagesList)
            }
            let convIndexToUpdate = conversationsList.findIndex(conv => conv.conversationId === selectedConversation['conversationId'])
            if (
                convIndexToUpdate >= 0 &&
                Object.keys(conversationsList[convIndexToUpdate]).includes('isNew') &&
                conversationsList[convIndexToUpdate]['isNew'] === true
            ) {
                let originalConvCloned = cloneDeep(conversationsList)
                let convCloned = cloneDeep(originalConvCloned[convIndexToUpdate])
                delete originalConvCloned[convIndexToUpdate]
                convCloned['isNew'] = false
                originalConvCloned[convIndexToUpdate] = convCloned
                dispatch(setConversationsList(originalConvCloned))
            }
        }
        if (Array.isArray(conversationsList) && conversationsList.length < 1) {
            const convObj = newConversationObject(v4(), `Conversation-${new Date().toISOString()}`, false)
            const convCloned = cloneDeep(
                [...conversationsList, convObj]
            )
            dispatch(setConversationsList(convCloned))
            dispatch(setSelectedConversation(
                { conversationId: convObj.conversationId, conversationTitle: convObj.conversationTitle }
            ))
            newMsgObj['conversationId'] = convObj.conversationId
            originalMessageList = [{ conversationId: convObj.conversationId, messages: [newMsgObj] }]
            displayMessageContent = [newMsgObj]
        }
        dispatch(postUserPrompt())
        dispatch(setMessagesList([...originalMessageList]))
        dispatch(setSelectedMessagesList(displayMessageContent))
        dispatch(setUserMessagesPrompt(''))
        return true
    }
    
    const handleUploadPromptClick = () => {

    }
    
    const handleKeyDown = (event) => {
        if ((event.shiftKey && event.key === "Enter") || (event.ctrlKey && event.key === "Enter")) {
            event.preventDefault();
            return handleSendPromptClick();
        }
    };
    
    const handleSpeechRecognitionClick = async () => {
        try {
            if (isListening) {
                setIsClicked(false);
                stopRecognition(); // Early stop on second click
                return;
            }
            const { transcript, audioUrl } = await startRecognition();
            setIsClicked(true);
            console.log('Voice input complete:', transcript, audioUrl);
            // Do something with the result like dispatching to Redux
        } catch (err) {
            console.error('Error during recognition:', err);
        }
    };
    
    return (
        <>
            <Flex style={{ background: '#fff', borderRight: '3.5px', boxShadow: '4px 6px 8px rgba(139, 137, 137, 0.9)', border: 'rgba(139, 137, 137, 0.9)' }}>

                <GetInputField maxLength={12000} inputType="textarea" colomnName="UserPrompt"
                    onRowUpdate={handleUserPrompt}
                    userValue={userPrompt}
                    style={{ background: 'transparent', border: 'none' }}
                    onKeyDown={handleKeyDown} />

                <ButtonComponent
                    id='voice-typing-button'
                    tooltipText='Recognize Speech | Interactive Voice Typing'
                    themeType='IconButton'
                    icon={<VoiceTypingFilledSVG isClicked={isClicked}/>}
                    onClickHandle={handleSpeechRecognitionClick}
                    style={{ background: 'transparent', border: 'none', alignItems: 'center' }}
                />

                <ButtonComponent
                    id='upload-file-button'
                    tooltipText='Upload File (text|Images|pdf|doc|excel)'
                    themeType='IconButton'
                    icon={<ClipFilledSVG />}
                    onClickHandle={handleUploadPromptClick}
                    style={{ background: 'transparent', border: 'none' }}
                />

                <ButtonComponent
                    id='send-prompt-button'
                    tooltipText='Send Prompt'
                    themeType='IconButton'
                    icon={<SendOutlinedSVG />}
                    onClickHandle={handleSendPromptClick}
                    style={{ background: 'transparent', border: 'none' }}
                />

            </Flex>
        </>
    )
}