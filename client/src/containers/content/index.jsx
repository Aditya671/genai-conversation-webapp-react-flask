
import { Flex } from "antd"
import { useSelector, useDispatch } from 'react-redux';
import { MessageCard } from "../../components/MessageCard"
import { useEffect } from "react"
import { cloneDeep, isArray, isEmpty } from "lodash";
import { messageTypes } from "../../helper/constants";


export const ContentComponent = () => {
    const messagesList = cloneDeep(useSelector((state) => state.messages.messagesList))
    return (
        <>
        {isArray(messagesList) && !isEmpty(messagesList) &&
        messagesList.map(msg => (
            <>
            <Flex
            justify={msg.messageType === messageTypes['bot'] ? "flex-start" : 'flex-end'}
            align="center"
            >
                <MessageCard
                    styleWidth={300}
                    messageAvatarSrc={msg.messageAvatarSrc}
                    messageDescription={msg.messageDescription}
                    messageSubDescription={msg.messageSubDescription}
                />
            </Flex>
            </>
            )
        )}
        </>
    )
}