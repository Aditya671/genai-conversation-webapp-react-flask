import { PageHeading } from "../../components/PageHeading";
import { displayDateTimeMessage } from "../../utility/utility";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep, isNull, isUndefined, size } from "lodash";
import { Flex, Layout, message, Row, Typography } from "antd";
import { Conversation, ConversationsState, setSelectedConversation } from "../../store/conversations/slice";
import { MessagesState, MessageWithConvId, setSelectedMessagesList } from "../../store/messages/slice";
import HistoryCardList from "../../components/HistoryCardList";
import { warningMessage } from "../../components/MessageModal";
import SelectDropdown from "../../components/SelectDropdown";
import { conversationsListSampleData } from "./../../sample_data";
import { BaseState } from "@/store/base/slice";
import DropdownMenuFilledSVG from '../../assets/svg/DropdownMenuFilledSVG';
import HistoryFilledSVG from '../../assets/svg/HistoryFilledSVG';
import Image from "next/image";

const { Title } = Typography;
const { Content } = Layout;


export const SidebarComponent: React.FC = () => {
    const [warningModalApiComponent, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const conversationsList = cloneDeep(conversationsListSampleData);
    // const conversationsList = useSelector((state: any) => state.conversations.conversationsList)
    const selectedConversationId = useSelector((state: {conversations: ConversationsState}) => state.conversations.selectedConversation ? state.conversations.selectedConversation.conversationId : '');
    const messagesList = useSelector((state: {messages: MessagesState}) => state.messages.messagesList);
    const {isUserPromptFieldInActiveState, isSidebarCollapsed} = useSelector((state: {base: BaseState}) => state.base);
    
    const handleConversationNameClick = (convObject: Conversation) => {
        if (isUserPromptFieldInActiveState) {
            return warningMessage(warningModalApiComponent, 'Please save/send the prompt message before selecting another conversation');
        }
        dispatch(setSelectedConversation(convObject));
        const convMessage = messagesList.find((msg: MessageWithConvId) => msg.conversationId === convObject.conversationId);
        if (convObject && (size(messagesList) > 0) && (!isUndefined(convMessage) && !isNull(convMessage))) {
            dispatch(setSelectedMessagesList(convMessage['messages']));
        }else {
            dispatch(setSelectedMessagesList([]))
        }
    };
    const handalModalSelectorChange = (selectedModal: string[] | string) => {
        // Implement modal selector change logic
        console.log('Selected Modal:', selectedModal);
    };
    return (
        <>
            {contextHolder}
            <Content>
                <Row align='middle' justify='center'>
                    {/* Replace logo only if it's an SVG, otherwise keep <Image /> for PNG */}
                    <Image alt="WebApp Logo" width={isSidebarCollapsed ? 48 : 64} height={isSidebarCollapsed ? 48 : 64} src="/chatbot-preview.png" />
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
                    style={!isSidebarCollapsed ? { margin: '8px 0', padding: '0 12px' } : { marginTop: '20px' }}
                >
                    {!isSidebarCollapsed ? (
                        <>
                            <SelectDropdown
                                componentName={'modalSelector'}
                                placeholder={'Select Modal'}
                                filterOptions={[{label: 'GPT-3.5', key: 'gpt-3.5', value: 'gpt-3.5'}, {label: 'GPT-4', key: 'gpt-4', value: 'gpt-4'}, {label: 'Claude', key: 'claude', value: 'claude'  }]}
                                sortOptions={true}
                                defaultValue={null}
                                onChange={handalModalSelectorChange}
                                selectionType={undefined}
                                onBeforeChange={undefined}
                                showSelectAllOption={false}
                                includeParentFilters={false}
                                pageName={''}
                                form={null}
                                onScroll={undefined}
                            />
                            <HistoryCardList
                                selectedConversationId={String(selectedConversationId) || ''}
                                conversations={conversationsList}
                                onConversationClick={handleConversationNameClick}
                            />
                            <PageHeading headingLevel={5} headingText={displayDateTimeMessage()} />
                        </>
                    ) : (
                        <>
                            <DropdownMenuFilledSVG />
                            <HistoryFilledSVG />
                        </>
                    )}
                </Flex>
            </Content>
        </>
    );
};
