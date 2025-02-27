
import { Flex, Space } from "antd"
import { useSelector, useDispatch } from 'react-redux';
import { MessageCard } from "../../components/MessageCard"
import { useEffect, useState } from "react"
import { cloneDeep, isArray, isEmpty, size } from "lodash";
import { messageTypes } from "../../helper/constants";
import { PageHeading } from "../../components/PageHeading";


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
    
    return (
        <>
        {isMessageListEmpty ?
            (<Space align="center" direction="vertical" size={2} style={{position:'absolute'}}>
                <PageHeading headingLevel={3} headingText="Welcome to Coversation WebApp!!"/>
                <PageHeading headingLevel={5} headingText="Your go to place for every conversation!!"/>
            </Space>
        ) : (
            <>
            {selectedConversationMessages
            .map(msg => (
                <Flex key={msg.messageId}
                justify={msg.messageType === messageTypes['bot'] ? "flex-start" : 'flex-end'}
                align="center"
                style={{margin:'8px 0'}}
                >
                    <MessageCard
                        styleWidth={300}
                        messageAvatarSrc={msg.messageAvatarSrc}
                        messageDescription={msg.messageDescription}
                        messageSubDescription={msg.messageSubDescription}
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