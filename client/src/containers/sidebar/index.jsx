import { PageHeading } from "../../components/PageHeading.jsx"
import { displayDateTimeMessage } from "../../utility/utility.js"
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
import { DropdownMenuFilledSVG } from "../../assets/svg/DropdownMenuFilledSVG.jsx"
import { HistoryFilledSVG } from "../../assets/svg/HistoryFilledSVG.jsx"

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
    const isSidebarCollapsed = useSelector((state) => state.base.isSidebarCollapsed ? state.base.isSidebarCollapsed : false)

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
        <Content>
            <Row span={2}  align='middle' justify='center' >
                <Image alt="WebApp Logo" width={isSidebarCollapsed ? 48 : 64} src={chatbotPreviewIcon}/>
                {!isSidebarCollapsed && <Title level={2}
                    className='theme-heading-font'
                    style={{
                        color: '#ffffff',
                        fontWeight: 'bold',
                        margin: 'auto 18px',
                        fontSize: '18px',
                    }} >ConvBot</Title>}
            </Row>
            <Flex
                wrap='wrap'
                justify={'center'}
                align="center"
                gap={20}
                style={ !isSidebarCollapsed ? {margin:'8px 0', padding:'0 12px'} : {marginTop:'20px'} }
            >
                {!isSidebarCollapsed ? (
                    <>
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
                    <PageHeading headingLevel={5} headingText={displayDateTimeMessage()} />
                    </>
                    ) : (
                    <>
                        <DropdownMenuFilledSVG/> 
                        <HistoryFilledSVG/>
                    </>
                    )
                }
            </Flex>

        </Content>
        </>
    )
}