import { Col, Image, Row } from "antd"
import chatbotPreviewIcon from '../../chatbot-preview.png'
import Title from "antd/es/typography/Title"
import { EditSVG } from "../../assets/svg/EditSVG"
import { ButtonComponent } from "../../components/Button"
import { useSelector, useDispatch } from 'react-redux';
import { setConversationsList, setSelectedConversation } from "../../store/conversations/slice"
import { cloneDeep } from "lodash"

export const HeaderComponent = (props) => {
    const dispatch = useDispatch();
    const conversationsList = cloneDeep(useSelector((state) => state.conversations.conversationsList))
    const selectedConversation = cloneDeep(useSelector((state) => state.conversations.selectedConversation))
    // setConversationsList
    // setSelectedConversation
    const generateNewChat = () => {
        // if Array.isArray(conversationsList) && conversationsList.length
        return 
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
            <Col span={18} style={{display:'flex', alignItems:'center', justifyContent:'flex-end'}}>
                <ButtonComponent
                    onClickHandle={generateNewChat}
                    tooltipText='Send Prompt' themeType='IconButton' icon={<EditSVG/>}
                />
            </Col>
            <Col span={3} ></Col>
        </Row>
    </>
    )
}