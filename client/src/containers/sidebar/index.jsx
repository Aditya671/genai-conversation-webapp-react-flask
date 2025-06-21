import { PageHeading } from "../../components/PageHeading"
import { displayDateTimeMessage } from "../../utility/utility"
import { useDispatch, useSelector } from "react-redux"
import chatbotPreviewIcon from '../../chatbot-preview.png'
import { cloneDeep, isNull, isUndefined, size } from "lodash"
import { Flex, Image, Layout, message, Row, Typography  } from "antd"
import { setSelectedConversation } from "../../store/conversations/slice"
import { setSelectedMessagesList } from "../../store/messages/slice"
import HistoryCardList from "../../components/HistoryCardList"
// import { getSelectedConvMessages } from "../../service/messages-list"
import { warningMessage } from "../../components/MessageModal"
import SelectDropdown from "../../components/SelectDropdown"
import { conversationsListSampleData } from "../../sample_data"

const { Title } = Typography;
const { Content} = Layout;

export const SidebarComponent = (props) => {
    const [warningModalApiComponent, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const conversationsList = cloneDeep(conversationsListSampleData)
    // const conversationsList = useSelector((state) => state.conversations.conversationsList)
    const selectedConversation = useSelector((state) => state.conversations.selectedConversation ? state.conversations.selectedConversation.conversationId : '')
    const isUserPromptFieldInActiveState = useSelector((state) => state.base.isUserPromptFieldInActiveState ? state.base.isUserPromptFieldInActiveState : false)    
    const messagesList = useSelector((state) => state.messages.messagesList)

    const handleConversationNameClick = (convObject) => {
        if(isUserPromptFieldInActiveState){
            return warningMessage(warningModalApiComponent, 'Please save/send the prompt message before selecting another conversation')
        }
        dispatch(setSelectedConversation(convObject))
        const convMessage = messagesList.find(msg => msg.conversationId === convObject.conversationId)
        if(convObject && (size(messagesList) > 0) && (!isUndefined(convMessage) && !isNull(convMessage))){
            dispatch(setSelectedMessagesList(convMessage['messages']))
        }
        // else{
        //     dispatch(getSelectedConvMessages(convObject.conversationId))
        // }
    }
    const handalModalSelectorChange = (selectedModal) => {

        }
    return (
        <>
        {contextHolder}
        <Content style={{height:'100%', padding:'10px 20px 20px 10px'}} >
            <Row span={2} >
                <Image alt="WebApp Logo" width={64} src={chatbotPreviewIcon}/>
                <Title level={2}
                    className='theme-heading-font'
                    style={{
                        color: '#ffffff',
                        fontWeight: 'bold',
                        margin: 'auto 18px',
                        fontSize: '18px',
                    }} >ConvBot</Title>
            </Row>
            <br/>
            
            <Flex
                wrap='wrap'
                justify={'center'}
                align="center"
                gap={20}
                style={{margin:'8px 0', padding:'0 12px'}}
            >
                <SelectDropdown
                    componentName={'modalSelector'}
                    placeholder={'Select Modal'}
                    filterOptions={[]}
                    sortOptions={true}
                    defaultValue={null}
                    onChange={handalModalSelectorChange}
                    selectionType={'multiple'}
                    onBeforeChange={null}
                    showSelectAllOption={false}
                    includeParentFilters={null}
                    pageName={''}
                    form={null}
                    onScroll={null}
                />
                <HistoryCardList
                    selectedConversation={selectedConversation} conversations={conversationsList}
                    onConversationClick={handleConversationNameClick}
                />
            </Flex>
            <PageHeading headingLevel={5} headingText={displayDateTimeMessage()} />

        </Content>
        </>
    )
}