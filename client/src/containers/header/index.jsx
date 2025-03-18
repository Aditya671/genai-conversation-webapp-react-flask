import { Col, Image, message, Row } from "antd"
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
import { DotMenuSVG } from "../../assets/svg/DotMenuSVG"
import { useEffect, useState } from "react"
import { warningMessage } from "../../components/MessageModal"

export const HeaderComponent = (props) => {
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const conversationsList = cloneDeep(useSelector((state) => state.conversations.conversationsList))
    const selectedConversation = cloneDeep(useSelector((state) => state.conversations.selectedConversation))
    const [displayedConvName, setDisplayedConversationName] = useState(selectedConversation['conversationTitle'])
    const isUserPromptFieldActiveState = useSelector((state) => state.base.isUserPromptFieldActiveState)

    // setSelectedConversation
    useEffect(() => {
        if(selectedConversation){
            setDisplayedConversationName(selectedConversation['conversationTitle'])
        }
    }, [selectedConversation])

    const generateNewChat = () => {
        if(isUserPromptFieldActiveState){
            return warningMessage(messageApi, 'Please save/send the prompt message before selecting another conversation')
        }
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
        const convObj = newConversationObject(v4(), `Conversation-${new Date().toISOString()}`)
        dispatch(setConversationsList(
            [...conversationsList, convObj]
        ))
        dispatch(setSelectedMessagesList([]))
        return dispatch(setSelectedConversation(
            {conversationId: convObj.conversationId, conversationTitle: convObj.conversationTitle}
        ))
        
    }
    return (
    <>
        {contextHolder}
        <Row>
            <Col span={2} >
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
                    headingLevel={5} headingText={displayedConvName || ''}
                    style={{color:'#00000073', fontWeight: 500, marginTop: 0, marginBottom: 2}}
                />
                
            </Col>
            <Col span={3} style={{alignItems:'center', justifyContent:'flex-end', display:'flex'}}>
                <ButtonComponent
                    onClickHandle={generateNewChat}
                    style={{background:'transparent', border:'none'}}
                    tooltipText='New Conversation' themeType='IconButton' icon={<EditChatSVG/>}
                />
                <ButtonComponent
                    icon={<DotMenuSVG/>} themeType='IconButton'
                    style={{background:'transparent', border:'none'}}
                    />
            </Col>
        </Row>
    </>
    )
}