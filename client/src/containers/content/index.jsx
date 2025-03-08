
import { Flex, Space } from "antd"
import { useSelector, useDispatch } from 'react-redux';
import { MessageCard } from "../../components/MessageCard"
import { useEffect, useState } from "react"
import { cloneDeep, isArray, isEmpty, size } from "lodash";
import { messageTypes } from "../../helper/constants";
import { PageHeading } from "../../components/PageHeading";
import { ButtonComponent } from "../../components/Button";
import { CopyFilledSVG } from "../../assets/svg/CopyFilledSVG";
import { EditFilledSVG } from "../../assets/svg/EditFilledSVG";
import { SaveFilledSVG } from "../../assets/svg/SaveFilledSVG";


export const ContentComponent = () => {
    const selectedConversationMessages = cloneDeep(useSelector((state) => state.messages.selectedConversationMessages))
    const [isMessageListEmpty, setIsMessageListEmpty] = useState(true);

    useEffect(() => {
        if (isArray(selectedConversationMessages) && size(selectedConversationMessages) === 0) {
            setIsMessageListEmpty(true);
        } else {
            setIsMessageListEmpty(false);
        }
    }, [selectedConversationMessages])
    const handleCopySelectedPrompt = () => {

    }
    const handleEditSelectedPrompt = () => {

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
                style={{margin:'20px 0'}}
                >
                    <MessageCard
                        styleWidth={300}
                        messageAvatarSrc={msg.messageAvatarSrc}
                        messageDescription={msg.messageDescription}
                        messageSubDescription={msg.messageSubDescription}
                        messageActions={[
                            <ButtonComponent
                                tooltipText='Copy Prompt' themeType='IconButton' icon={<CopyFilledSVG key="copy" />}
                                onClickHandle={() => handleCopySelectedPrompt(msg.messageId)}
                                style={{background:'transparent', border:'none'}}
                            />,
                            <ButtonComponent
                                tooltipText='Edit Prompt' themeType='IconButton' icon={<EditFilledSVG key="edit" />}
                                onClickHandle={() => handleEditSelectedPrompt(msg.messageId)}
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