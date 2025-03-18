import { Content } from "antd/es/layout/layout"
import { PageHeading } from "../../components/PageHeading"
import { displayDateTimeMessage } from "../../utility/utility"
import { useDispatch, useSelector } from "react-redux"
import { isNull, isUndefined, size } from "lodash"
import { Flex, message } from "antd"
import { setSelectedConversation } from "../../store/conversations/slice"
import { setSelectedMessagesList } from "../../store/messages/slice"
import HistoryCardList from "../../components/HistoryCardList"
import { getSelectedConvMessages } from "../../service/messages-list"
import { warningMessage } from "../../components/MessageModal"

export const SidebarComponent = (props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const conversationsList = useSelector((state) => state.conversations.conversationsList)
    const messagesList = useSelector((state) => state.messages.messagesList)
    const selectedConversation = useSelector((state) => state.conversations.selectedConversation)
    const isUserPromptFieldActiveState = useSelector((state) => state.base.isUserPromptFieldActiveState)
    const handleConversationNameClick = (convObject) => {
        if(isUserPromptFieldActiveState){
            return warningMessage(messageApi, 'Please save/send the prompt message before selecting another conversation')
        }
        dispatch(setSelectedConversation(convObject))
        const convMessage = messagesList.find(msg => msg.conversationId === convObject.conversationId)
        if(convObject && (size(messagesList) > 0) && (!isUndefined(convMessage) && !isNull(convMessage))){
            dispatch(setSelectedMessagesList(convMessage['messages']))
        }else{
            dispatch(getSelectedConvMessages(convObject.conversationId))
        }
    }
    return (
        <>
        {contextHolder}
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
                <HistoryCardList
                    selectedConversation={selectedConversation} conversations={conversationsList}
                    onConversationClick={handleConversationNameClick}
                />
            </Flex>
        </Content>
        </>
    )
}