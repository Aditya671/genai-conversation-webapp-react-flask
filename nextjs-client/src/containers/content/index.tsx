import { Flex, Space, Layout } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { MessageCard } from "../../components/MessageCard";
import { useEffect, useState } from "react";
import { cloneDeep, isArray, size } from "lodash";
import { messageTypes } from "../../helper/constants";
import { PageHeading } from "../../components/PageHeading";
import { ButtonComponent } from "../../components/Button";
import TextToSpeech from "../../components/TextToSpeech";
import React from "react";
import markdownToTxt from 'markdown-to-txt';
import { Message, MessagesState, setUserMessagesPrompt } from "../../store/messages/slice";
import CopyFilledSVG from '../../assets/svg/CopyFilledSVG';
import EditFilledSVG from '../../assets/svg/EditFilledSVG';
import SaveFilledSVG from '../../assets/svg/SaveFilledSVG';
import { LikeFilledSVG } from "@/assets/svg/LikeFilledSVG";
import { DisLikeFilledSVG } from "@/assets/svg/DisLikeFilledSVG";

const { Content } = Layout;

interface ContentComponentProps {
    children?: React.ReactNode;
}

export const ContentComponent: React.FC<ContentComponentProps> = ({ children }) => {
    const dispatch = useDispatch();
    const selectedConversationMessages: Message[] = cloneDeep(
        useSelector((state: { messages: MessagesState }) => state.messages.selectedConversationMessages)
    );
    const [isMessageListEmpty, setIsMessageListEmpty] = useState(true);

    useEffect(() => {
        if (isArray(selectedConversationMessages) && size(selectedConversationMessages) === 0) {
            setIsMessageListEmpty(true);
        } else {
            setIsMessageListEmpty(false);
        }
    }, [selectedConversationMessages]);

    const handleCopySelectedPrompt = (msg: string) => {
        navigator.clipboard.writeText(msg);
        dispatch(setUserMessagesPrompt(msg));
    };
    const handleEditSelectedPrompt = (msgId: string, convId?: string) => {
        // Implement edit logic
        console.log(`Editing message with ID: ${msgId} in conversation ID: ${convId}`);
    };
    const handleSaveSelectedPrompt = (msgId?: string) => {
        // Implement save logic
        console.log(`Saving message with ID: ${msgId}`);
    };
    return (
        <Content style={{ padding: 0, background: 'transparent', minHeight: '100%', position: 'relative' }}>
            {isMessageListEmpty ? (
                <Space align="center" direction="vertical" size={2} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <PageHeading
                        style={{ color: '#1f1f1f', fontWeight: 700, marginTop: 0, marginBottom: 2, padding: '0 10px' }}
                        headingLevel={3}
                        headingText="Welcome to Conversation WebApp!!"
                    />
                    <PageHeading
                        style={{ color: '#1f1f1f', fontWeight: 700, marginTop: 0, marginBottom: 2, padding: '0 10px' }}
                        headingLevel={5}
                        headingText="Your go to place for every conversation!!"
                    />
                </Space>
            ) : (
                <>
                    {selectedConversationMessages.map((msg: Message) => (
                        <Flex
                            key={msg.messageId}
                            justify={msg.messageType === messageTypes['bot'] ? 'flex-start' : 'flex-end'}
                            align="center"
                            style={{ margin: '20px 0', position: 'relative' }}
                        >
                            <MessageCard
                                styleWidth={300}
                                messageAvatarSrc={msg.messageAvatarSrc}
                                messageDescription={{
                                    element: (
                                        <React.Fragment>
                                            <TextToSpeech
                                                text={markdownToTxt(msg.messageDescription)}
                                                style={msg.messageType && messageTypes['bot'] === 'flex-start'
                                                    ? {
                                                        position: 'absolute', top: '-8px', right: '-12px', background: 'transparent',
                                                        zIndex: 1, border: 'none', textAlign: 'center', padding: '2px',
                                                    }
                                                    : {
                                                        position: 'absolute', top: '-8px', right: '-12px', background: 'transparent',
                                                        zIndex: 1, border: 'none', textAlign: 'center', padding: '2px',
                                                    }
                                                }
                                            />
                                        </React.Fragment>
                                    ),
                                    desc: msg.messageDescription,
                                }}
                                messageSubDescription={msg.messageDateTimeCreated}
                                messageActions={[
                                    <ButtonComponent
                                        key={`copy-prompt-${msg.messageId}`}
                                        id={`copy-prompt-${msg.messageId}`}
                                        tooltipText={msg.messageType === messageTypes['user'] ? "Copy Prompt": "Copy Response"}
                                        themeType="IconButton"
                                        icon={<CopyFilledSVG />}
                                        onClickHandle={() => handleCopySelectedPrompt(msg.messageDescription)}
                                        style={{ background: 'transparent', border: 'none' }}
                                    />,
                                    ...msg.messageType === messageTypes['user'] ? [<ButtonComponent
                                        key={`edit-prompt-${msg.messageId}`}
                                        id={`edit-prompt-${msg.messageId}`}
                                        tooltipText="Edit Prompt"
                                        themeType="IconButton"
                                        icon={<EditFilledSVG />}
                                        onClickHandle={() => handleEditSelectedPrompt(String(msg.messageId), String(msg.conversationId))}
                                        style={{ background: 'transparent', border: 'none' }}
                                    />,
                                    <ButtonComponent
                                        key={`save-prompt-${msg.messageId}`}
                                        id={`save-prompt-${msg.messageId}`}
                                        tooltipText="Save Prompt"
                                        themeType="IconButton"
                                        icon={<SaveFilledSVG />}
                                        onClickHandle={() => handleSaveSelectedPrompt(String(msg.messageId))}
                                        style={{ background: 'transparent', border: 'none' }}
                                    />] : [
                                        <ButtonComponent
                                        key={`good-response-${msg.messageId}`}
                                        id={`good-response-${msg.messageId}`}
                                        tooltipText="Good Response"
                                        themeType="IconButton"
                                        icon={<LikeFilledSVG />}
                                        onClickHandle={() => handleEditSelectedPrompt(String(msg.messageId), String(msg.conversationId))}
                                        style={{ background: 'transparent', border: 'none' }}
                                    />,
                                    <ButtonComponent
                                        key={`bad-response-${msg.messageId}`}
                                        id={`bad-response-${msg.messageId}`}
                                        tooltipText="Bad Response"
                                        themeType="IconButton"
                                        icon={<DisLikeFilledSVG />}
                                        onClickHandle={() => handleEditSelectedPrompt(String(msg.messageId), String(msg.conversationId))}
                                        style={{ background: 'transparent', border: 'none' }}
                                    />
                                    ],
                                ]}
                            />
                        </Flex>
                    ))}
                </>
            )}
            {children}
        </Content>
    );
};
