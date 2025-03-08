import { Content } from "antd/es/layout/layout"
import { PageHeading } from "../../components/PageHeading"
import { displayDateTimeMessage } from "../../utility/utility"
import { useDispatch, useSelector } from "react-redux"
import { isNull, isUndefined, size } from "lodash"
import { Flex } from "antd"
import { setSelectedConversation } from "../../store/conversations/slice"
import { setSelectedMessagesList } from "../../store/messages/slice"
import HistoryCardList from "../../components/HistoryCardList"

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
        <Content style={{height:'100%', padding:'20px 6px'}} >
            <PageHeading headingLevel={3} headingText={displayDateTimeMessage()} />
            <br/>
            <Flex
                wrap='wrap'
                justify={'center'}
                align="center"
                gap={8}
                style={{margin:'8px 0', padding:'0 12px'}}
            >
                <HistoryCardList selectedConversation={selectedConversation} conversations={conversationsList}/>
            </Flex>
        </Content>
        </>
    )
}