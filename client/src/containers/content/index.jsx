
import { Flex, Space } from "antd"
import { useDispatch, useSelector } from 'react-redux';
import { MessageCard } from "../../components/MessageCard"
import { useEffect, useState } from "react"
import { cloneDeep, isArray, size } from "lodash";
import { messageTypes } from "../../helper/constants";
import { PageHeading } from "../../components/PageHeading";
import { ButtonComponent } from "../../components/Button";
import { CopyFilledSVG } from "../../assets/svg/CopyFilledSVG";
import { EditFilledSVG } from "../../assets/svg/EditFilledSVG";
import { SaveFilledSVG } from "../../assets/svg/SaveFilledSVG";
import { setUserMessagesPrompt } from "../../store/messages/slice";
import TextToSpeech from "../../components/TextToSpeech";
import React from "react";
import markdownToTxt from 'markdown-to-txt';

export const ContentComponent = () => {
    const dispatch = useDispatch();
    const selectedConversationMessages = cloneDeep(useSelector((state) => state.messages.selectedConversationMessages))
    const [isMessageListEmpty, setIsMessageListEmpty] = useState(true);

    useEffect(() => {
        if (isArray(selectedConversationMessages) && size(selectedConversationMessages) === 0) {
            setIsMessageListEmpty(true);
        } else {
            setIsMessageListEmpty(false);
        }
    }, [selectedConversationMessages])
    const handleCopySelectedPrompt = (msg) => {
        navigator.clipboard.writeText(msg)
        dispatch(setUserMessagesPrompt(msg))
    }
    const handleEditSelectedPrompt = (msgId, convId) => {

    }
    const handleSaveSelectedPrompt = () => {
        
    }
    return (
        <>
        {isMessageListEmpty ?
            (<Space align="center" direction="vertical" size={2} style={{position:'absolute'}}>
                <PageHeading style={{
                    color:'#1f1f1f', fontWeight: 700,
                    marginTop: 0, marginBottom: 2,
                    padding:'0 10px'}}
                    headingLevel={3} headingText="Welcome to Coversation WebApp!!"/>
                <PageHeading style={{
                    color:'#1f1f1f', fontWeight: 700,
                    marginTop: 0, marginBottom: 2,
                    padding:'0 10px'}}
                    headingLevel={5} headingText="Your go to place for every conversation!!"/>
            </Space>
        ) : (
            <>
            {selectedConversationMessages
            .map(msg => (
                <Flex key={msg.messageId}
                justify={msg.messageType === messageTypes['bot'] ? "flex-start" : 'flex-end'}
                align="center"
                style={{margin:'20px 0', position:'relative'}}
                >
                    <MessageCard
                        styleWidth={300}
                        messageAvatarSrc={msg.messageAvatarSrc}
                        messageDescription={
                        {element:<React.Fragment>
                        <TextToSpeech
                            text={markdownToTxt(msg.messageDescription)}
                            style={msg.messageType && messageTypes['bot'] === "flex-start" ? {
                                position: 'absolute',top: '-8px', right: '-12px', background: 'transparent',
                                zIndex: 1, border:'none', textAlign: 'center', padding: '2px',
                                } : {
                                position: 'absolute',top: '-8px', right: '-12px', background: 'transparent',
                                zIndex: 1, border:'none', textAlign: 'center', padding: '2px'
                                }
                            }
                        />
                        </React.Fragment>,
                        desc:msg.messageDescription
                        }
                        }
                        messageSubDescription={msg.messageDateTimeCreated}
                        messageActions={[
                            <ButtonComponent
                                tooltipText='Copy Prompt' themeType='IconButton' icon={<CopyFilledSVG key="copy" />}
                                onClickHandle={() => handleCopySelectedPrompt(msg.messageDescription)}
                                style={{background:'transparent', border:'none'}}
                            />,
                            <ButtonComponent
                                tooltipText='Edit Prompt' themeType='IconButton' icon={<EditFilledSVG key="edit" />}
                                onClickHandle={() => handleEditSelectedPrompt(msg.messageId, msg.conversationId)}
                                style={{background:'transparent', border:'none'}}
                            />,
                            <ButtonComponent
                                tooltipText='Save Prompt' themeType='IconButton' icon={<SaveFilledSVG key="save" />}
                                onClickHandle={() => handleSaveSelectedPrompt(msg.messageId)}
                                style={{background:'transparent', border:'none'}}
                            />
                        ]}
                    />
                </Flex>
                )
            )}
            </>
        )
        }
        </>
    )
}