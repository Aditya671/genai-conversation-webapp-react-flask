import { Content } from "antd/es/layout/layout"
import { PageHeading } from "../../components/PageHeading"
import { displayDateTimeMessage } from "../../utility/utility"
import { useSelector } from "react-redux"
import { isArray, size } from "lodash"


export const SidebarComponent = ({

}) => {
    const conversationsList = useSelector((state) => state.conversations.conversationsList)
    const selectedConversation = useSelector((state) => state.conversations.selectedConversation)
    return (
        <>
        <Content style={{maxHeight:'100%', padding:'20px 6px'}} >
            <PageHeading headingLevel={3} headingText={displayDateTimeMessage()} />
            {isArray(conversationsList) && size(conversationsList) > 0 &&
            conversationsList.map(conv => (
                <div key={conv.conversationId}>
                    {conv.conversationTitle}
                </div>
            ))}
        </Content>
        </>
    )
}