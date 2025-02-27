import { Col, Image, Row } from "antd"
import chatbotPreviewIcon from '../../chatbot-preview.png'
import Title from "antd/es/typography/Title"
import { EditChatSVG } from "../../assets/svg/EditChatSVG"
import { ButtonComponent } from "../../components/Button"
import { useSelector, useDispatch } from 'react-redux';
import { setConversationsList, setSelectedConversation } from "../../store/conversations/slice"
import { cloneDeep, isArray, size } from "lodash"
import { newConversationObject } from "../../helper/constants"
import { v4 } from "uuid"
import { setSelectedMessagesList } from "../../store/messages/slice"
import { PageHeading } from "../../components/PageHeading"

export const HeaderComponent = (props) => {
    const dispatch = useDispatch();
    const conversationsList = cloneDeep(useSelector((state) => state.conversations.conversationsList))
    const selectedConversation = cloneDeep(useSelector((state) => state.conversations.selectedConversation))
    // setConversationsList
    // setSelectedConversation
    const generateNewChat = () => {
        const isConvList = isArray(conversationsList)
        const convSize = isConvList ? size(conversationsList) : 0
        
        if(isConvList && convSize >= 1){
            let lastConv = conversationsList[convSize - 1]
            let isConvNew = lastConv['isNew']
            if(isConvNew){
                return dispatch(setSelectedConversation(
                    {conversationId: lastConv['conversationId'], conversationTitle: lastConv['conversationTitle']}
                ))
            }
        }
        let conversationId = v4()
        dispatch(setConversationsList(
            [...conversationsList, newConversationObject(conversationId, `Conv-${conversationId}`)]
        ))
        dispatch(setSelectedMessagesList([]))
        return dispatch(setSelectedConversation(
            {conversationId: conversationId, conversationTitle: `Conv-${conversationId}`}
        ))
        
    }
    return (
    <>
        <Row>
            <Col span={3} >
                <Image alt="WebApp Logo" width={64} src={chatbotPreviewIcon}/>
                <Title level={2}
                    className='theme-heading-font'
                    style={{
                        color: '#1f1f1f',
                        fontWeight: 'bold',
                        margin: '0 0 0 8px',
                        fontSize: '12px',
                    }} >ConvBot</Title>
            </Col>
            <Col span={18} style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <PageHeading
                    headingLevel={5} headingText={selectedConversation['conversationTitle'] || ''}
                    style={{color:'#00000073', fontWeight: 500, marginTop: 0, marginBottom: 2}}
                />
                <ButtonComponent
                    onClickHandle={generateNewChat}
                    tooltipText='New Conversation' themeType='IconButton' icon={<EditChatSVG/>}
                />
            </Col>
            <Col span={3} ></Col>
        </Row>
    </>
    )
}