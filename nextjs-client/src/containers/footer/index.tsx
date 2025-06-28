import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from "uuid";
import { Flex } from "antd";
import { useSelector, useDispatch } from 'react-redux';
import { GetInputField, InputFieldValueType, RecordType } from "../../components/InputField";
import { ButtonComponent } from "../../components/Button";
import { errorModal } from "../../components/MessageModal";
import { createNewMessage, newConversationObject } from "../../helper/constants";
import { Message, MessagesState, MessageWithConvId, setMessagesList, setSelectedMessagesList, setUserMessagesPrompt } from "../../store/messages/slice";
import { Conversation, ConversationsState, setConversationsList, setSelectedConversation } from "../../store/conversations/slice";
import { setUserPromptFieldActiveState, setVoiceRecordingActiveState } from '../../store/base/slice';
import { postUserPrompt } from '../../service/messages-list';
import { useSpeechRecognizer } from '../../hooks/useSpeechRecognizer';
import VoiceTypingFilledSVG from '../../assets/svg/VoiceTypingFilledSVG';
import ClipFilledSVG from '../../assets/svg/ClipFilledSVG';
import SendOutlinedSVG from '../../assets/svg/SendOutlinedSVG';


export const FooterComponent: React.FC = () => {
    
    const selectedConversationMessages = cloneDeep(useSelector((state: {messages : MessagesState}) => state.messages.selectedConversationMessages));
    const globalMessagesList = cloneDeep(useSelector((state: {messages: MessagesState}) => state.messages.messagesList));
    const userPrompt = cloneDeep(useSelector((state: {messages : MessagesState}) => state.messages.userPrompt));
    const conversationsList = useSelector((state: {conversations: ConversationsState}) => state.conversations.conversationsList);
    const selectedConversation = useSelector((state: {conversations: ConversationsState}) => state.conversations.selectedConversation);
    const isVoiceRecordingActive = useSelector((state: {base: {isVoiceRecordingActive: boolean}}) => state.base.isVoiceRecordingActive);
    const dispatch = useDispatch();
    const { isListening, startRecognition, stopRecognition } = useSpeechRecognizer();


    const handleUserPrompt = (colomnName: string, row: Message | Conversation | RecordType, rowIndex: number, promptMessage: InputFieldValueType) => {
        dispatch(setUserMessagesPrompt(String(promptMessage)));
        if (!promptMessage) {
            return dispatch(setUserPromptFieldActiveState(true));
        }
        return dispatch(setUserPromptFieldActiveState(false));
    };

    const handleSendPromptClick = () => {
        if (!userPrompt) {
            return errorModal('User Prompt', 'Please enter prompt message');
        }
        const ongoingConvMessages = cloneDeep(selectedConversationMessages);
        const originalMessagesList = cloneDeep(globalMessagesList);
        const newMsgObj = createNewMessage(userPrompt);
        const newConvMessagesList: MessageWithConvId = {
            conversationId: '',
            messages: []
        };
        if (selectedConversation && selectedConversation.conversationId) {
            newMsgObj['conversationId'] = selectedConversation['conversationId'];
            ongoingConvMessages.push(newMsgObj);

            const originalMessagesListIndex = originalMessagesList.findIndex((convMsg: MessageWithConvId) => convMsg.conversationId === selectedConversation['conversationId']);
            
            if (originalMessagesListIndex >= 0) {
                const originalConvMessageObjClone = cloneDeep(originalMessagesList[originalMessagesListIndex]);
                // delete ongoingConvMessages[originalMessagesListIndex];
                // ongoingConvMessages[originalMessagesListIndex] = ongoingConvMessages;
                // ongoingConvMessages[originalMessagesListIndex] = ongoingConvMessagesCloned;
                originalConvMessageObjClone['messages'] = ongoingConvMessages;
                originalMessagesList.push(originalConvMessageObjClone);
                dispatch(setMessagesList(originalMessagesList));
                dispatch(setSelectedMessagesList(ongoingConvMessages));
            } 
            else {
                newConvMessagesList['messages'] = ongoingConvMessages;
                newConvMessagesList['conversationId'] = selectedConversation['conversationId'];
                dispatch(setSelectedMessagesList(ongoingConvMessages));
                const globalConvMessagesWithNewConv = cloneDeep([...globalMessagesList, newConvMessagesList]);
                dispatch(setMessagesList(globalConvMessagesWithNewConv));
            }
        }
        const conversationObjClone = cloneDeep(conversationsList);
        const convIndexToUpdate = conversationObjClone.findIndex((conv: Conversation) => conv.conversationId === selectedConversation['conversationId']);
        if (convIndexToUpdate >= 0) {
            const convObj = cloneDeep(conversationObjClone[convIndexToUpdate]);
            convObj['isNew'] = false;
            conversationObjClone[convIndexToUpdate] = convObj;
            dispatch(setConversationsList(cloneDeep(conversationObjClone)));
        } else{
            const newConvObj = newConversationObject(uuidv4(), `Conversation-${new Date().toISOString()}`, false);
            const convListClone = cloneDeep([...conversationObjClone, newConvObj]);
            dispatch(setConversationsList(convListClone));
            dispatch(setSelectedConversation(newConvObj));
        }
        postUserPrompt();
        dispatch(setUserMessagesPrompt(''));
        return dispatch(setUserPromptFieldActiveState(false));
    };

    const handleUploadPromptClick = () => {
        // Implement upload logic
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((event.shiftKey && event.key === "Enter") || (event.ctrlKey && event.key === "Enter")) {
            event.preventDefault();
            return handleSendPromptClick();
        }
    };

    const handleSpeechRecognitionClick = async () => {
        try {
            if (isListening) {
                stopRecognition();
                return dispatch(setVoiceRecordingActiveState(false))
            }
            const { transcript, audioUrl } = await startRecognition();
            dispatch(setVoiceRecordingActiveState(true));
            console.log('Voice input complete:', transcript, audioUrl);
            // Do something with the result like dispatching to Redux
        } catch (err) {
            console.error('Error during recognition:', err);
            return dispatch(setVoiceRecordingActiveState(false))
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
                    icon={<VoiceTypingFilledSVG isClicked={isVoiceRecordingActive}/>} 
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
    );
};
