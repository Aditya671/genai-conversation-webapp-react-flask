import { Content } from "antd/es/layout/layout"
import { PageHeading } from "../../components/PageHeading"
import { displayDateTimeMessage } from "../../utility/utility"
import { useDispatch, useSelector } from "react-redux"
import { isArray, isNull, isUndefined, size } from "lodash"
import { Flex, Typography } from "antd"
import { setSelectedConversation } from "../../store/conversations/slice"
import { setSelectedMessagesList } from "../../store/messages/slice"

export const SidebarComponent = ({

}) => {
    const dispatch = useDispatch();
    const conversationsList = useSelector((state) => state.conversations.conversationsList)
    const messagesList = useSelector((state) => state.messages.messagesList)
    const selectedConversation = useSelector((state) => state.conversations.selectedConversation)
    const handleConversationNameClick = (convObject) => {
        dispatch(setSelectedConversation(convObject))
        const convMessage = messagesList.find(msg => msg.conversationId === convObject.conversationId)
        if(convObject && (size(messagesList) > 0) && (!isUndefined(convMessage) && !isNull(convMessage))){
            dispatch(setSelectedMessagesList(convMessage['messages']))
        }
    }
    return (
        <>
        <Content style={{maxHeight:'100%', padding:'20px 6px'}} >
            <PageHeading headingLevel={3} headingText={displayDateTimeMessage()} />
            <Flex
                wrap='wrap'
                justify={'center'}
                align="center"
                gap={8}
                style={{margin:'8px 0', padding:'0 12px'}}
            >
            {isArray(conversationsList) && size(conversationsList) > 0 &&
            conversationsList.map(conv => (
                <Typography.Text
                    type={selectedConversation.conversationId === conv.conversationId ? 'secondary' : '#000000e0'}
                    onClick={() => handleConversationNameClick(conv)}
                    key={conv.conversationId}
                >
                    {conv.conversationTitle}
                </Typography.Text>
            ))}
            </Flex>
        </Content>
        </>
    )
}