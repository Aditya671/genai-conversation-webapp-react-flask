import React, { useState } from 'react';
import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from "uuid";
import { Flex, List, Upload, UploadFile, Space, Collapse } from "antd";
import { useSelector, useDispatch } from 'react-redux';
import { GetInputField, InputFieldValueType, RecordType } from "../../components/InputField";
import { ButtonComponent } from "../../components/Button";
import { errorModal } from "../../components/MessageModal";
import { createNewMessage, newConversationObject } from "../../helper/constants";
import {
    Message, MessagesState, MessageWithConvId,
    setMessagesList, setSelectedMessagesList, setUserMessagesPrompt
} from "../../store/messages/slice";
import {
    Conversation, ConversationsState,
    setConversationsList, setSelectedConversation
} from "../../store/conversations/slice";
import {
    collapseItemsInterface,
    setUploadedFilesTempLocation,
    setUserPromptFieldActiveState,
    setVoiceRecordingActiveState,
    setUploadedFilesDisplayList
} from '../../store/base/slice';
import { postUserPrompt } from '../../service/messages-list';
import { useSpeechRecognizer } from '../../hooks/useSpeechRecognizer';
import VoiceTypingFilledSVG from '../../assets/svg/VoiceTypingFilledSVG';
import ClipFilledSVG from '../../assets/svg/ClipFilledSVG';
import SendOutlinedSVG from '../../assets/svg/SendOutlinedSVG';
import { PageHeading } from '@/components/PageHeading';
import DeleteOutlinedSVG from '@/assets/svg/DeleteOutlinedSVG';
import './footer.css'


export const FooterComponent: React.FC = () => {
    
    const selectedConversationMessages = cloneDeep(useSelector((state: {messages : MessagesState}) => state.messages.selectedConversationMessages));
    const globalMessagesList = cloneDeep(useSelector((state: {messages: MessagesState}) => state.messages.messagesList));
    const userPrompt = cloneDeep(useSelector((state: {messages : MessagesState}) => state.messages.userPrompt));
    const conversationsList = useSelector((state: {conversations: ConversationsState}) => state.conversations.conversationsList);
    const selectedConversation = useSelector((state: {conversations: ConversationsState}) => state.conversations.selectedConversation);
    const isVoiceRecordingActive = useSelector((state: {base: {isVoiceRecordingActive: boolean}}) => state.base.isVoiceRecordingActive);
    const uploadedFilesTempLocation = useSelector((state: {base: {uploadedFilesTempLocation: FileList[] | []}}) => state.base.uploadedFilesTempLocation);
    const uploadedFilesDisplayList = useSelector((state: {base: {uploadedFilesDisplayList: collapseItemsInterface[] | []}}) => state.base.uploadedFilesDisplayList);
    const { isListening, startRecognition, stopRecognition } = useSpeechRecognizer();

    const [uploadFilesCardPosition, setUploadFilesCardPosition] = useState<{inset: string}>({
        inset: '-40px 0 0 0',
    }); 
    const dispatch = useDispatch();
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
    const handleUploadChange = async (info: { fileList: UploadFile[] }) => {
        const items = [{
            key: '1',
            label: <PageHeading headingLevel={5} headingText='Uploaded Files'
                style={{ margin: 0, padding: 0, color:'#f1f1f1'}} />,
            style: undefined,
            className: 'uploaded-files-collapse-header',
            children: (
                <List
                    key='1'
                    style={{
                        width: '100%', padding: '0 8px'
                    }}
                    size='small'
                    id='uploaded-files-list'
                    dataSource={uploadedFilesTempLocation}
                    renderItem={() => 
                        info.fileList.slice(-5).map((file) => (
                        <List.Item
                            actions={[
                                <ButtonComponent key={file.uid}
                                    themeType='IconButton' icon={<DeleteOutlinedSVG />}
                                    onClickHandle={() => {}}
                            />
                            ]}
                            key={file.uid}
                            style={{ marginLeft: 10, color: '#000', padding: '2px 0'}}
                        >
                        {file.name}
                        </List.Item>
                    ))}
                />
            )
            }]
        await dispatch(setUploadedFilesDisplayList(items))
        await dispatch(setUploadedFilesTempLocation(info.fileList));
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
            <Flex align='center' justify='space-between' wrap='wrap'
                style={{
                    background: '#fff',
                    position:'relative',
                    borderRight: '3.5px',
                    boxShadow: '4px 6px 8px rgba(139, 137, 137, 0.9)',
                    border: 'rgba(139, 137, 137, 0.9)',
                    width: '100%',
                    borderRadius: '0 0 8px 8px',
                }}>
                {uploadedFilesTempLocation.length > 0 && 
                    <Collapse
                        onChange={(arr) => (
                            Array.isArray(arr) && arr.length > 0 ?
                            setUploadFilesCardPosition({ inset: '-130px 0 0 0' }) :
                            setUploadFilesCardPosition({ inset: '-40px 0 0 0' })
                        )}
                        key='uploaded-files-collapse'
                        size='small'
                        accordion
                        style={{
                            width:'inherit', maxHeight: '130px', overflowY:'auto',
                            boxShadow: '4px 0px 0px rgba(139, 137, 137, 0.9)',
                            borderRadius: '8px 8px 0 0',
                            position: 'absolute', ...uploadFilesCardPosition}}
                        items={uploadedFilesDisplayList}
                    />
                }
                <GetInputField maxLength={12000} inputType="textarea" colomnName="UserPrompt"
                    onRowUpdate={handleUserPrompt}
                    userValue={userPrompt}
                    style={{ background: 'transparent', border: 'none', width: 'calc(100% - 150px)' }}
                    onKeyDown={handleKeyDown}
                />
                <Space size="small" style={{ width: 120, justifyContent:'space-between' }} align='center'>
                    <ButtonComponent
                        id='voice-typing-button'
                        tooltipText='Recognize Speech | Interactive Voice Typing'
                        themeType='IconButton'
                        icon={<VoiceTypingFilledSVG isClicked={isVoiceRecordingActive}/>} 
                        onClickHandle={handleSpeechRecognitionClick}
                        style={{ background: 'transparent', border: 'none', alignItems: 'center' }}
                    />
                    <Upload
                        id='upload-file-component'
                        accept=".txt,.pdf,.docx,.xlsx/*"
                        showUploadList={false}
                        multiple={true}
                        maxCount={5}
                        onChange={handleUploadChange}
                        beforeUpload={() => false}
                    >
                        <ButtonComponent
                            id='upload-file-button'
                            tooltipText='Upload File (text|pdf|doc|excel)'
                            themeType='IconButton'
                            icon={<ClipFilledSVG />} 
                            onClickHandle={handleUploadPromptClick}
                            style={{ background: 'transparent', border: 'none' }}
                        />
                    </Upload>               
                    <ButtonComponent
                        id='send-prompt-button'
                        tooltipText='Send Prompt'
                        themeType='IconButton'
                        icon={<SendOutlinedSVG />} 
                        onClickHandle={handleSendPromptClick}
                        style={{ background: 'transparent', border: 'none' }}
                    />
                </Space>
            </Flex>
        </>
    );
};
