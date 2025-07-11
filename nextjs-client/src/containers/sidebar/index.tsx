
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { cloneDeep, isNull, isUndefined, size } from "lodash";
import { Flex, Layout, message, Row, Space, Typography } from "antd";
import { Conversation, setSelectedConversation } from "../../store/conversations/slice";
import { MessageWithConvId, setSelectedMessagesList } from "../../store/messages/slice";
import ItemsListCard from "../../components/ItemsListCard";
import { warningMessage } from "../../components/MessageModal";
import SelectDropdown from "../../components/SelectDropdown";
import { BaseState, CollapsedDataContainerType, setShowCollapsedData } from "@/store/base/slice";
import DropdownMenuFilledSVG from '../../assets/svg/DropdownMenuFilledSVG';
import LLMFilledSVG from '../../assets/svg/LLMFilledSVG';
import Image from "next/image";
import { ButtonComponent } from "@/components/Button";
import PushpinFilledSVG from "@/assets/svg/PushpinFilledSVG";
import './index.css';
import { getMessagesList } from "@/service/messages-service";
import { conversationObjectUpdateTypes } from "@/helper/constants";
import { updateConversationObject } from "@/service/conversations-service";
import { useState } from "react";


const { Title } = Typography;
const { Content } = Layout;
export const SidebarComponent: React.FC = () => {
    const [warningModalApiComponent, contextHolder] = message.useMessage();
    const [selectedModel, setSelectedModel] = useState<string[]>([]);
    const dispatch = useAppDispatch();
    const {
        conversationsList, selectedConversation
    } = cloneDeep(useAppSelector((state) => state.conversations));
    const llmModels = useAppSelector((state) => state.base.llmModels);
    const messagesList = useAppSelector((state) => state.messages.messagesList);
    const userId = useAppSelector((state) => state.users.userId);


    const {
        isUserPromptFieldInActiveState,
        isSidebarCollapsed,
        showCollapsedData
    } = useAppSelector((state: {base: BaseState}) => state.base);
    
    const handleCollapsedDataVisibility = (collapseDataProp: CollapsedDataContainerType) => {
        if(collapseDataProp === showCollapsedData) {
            dispatch(setShowCollapsedData(''))
        }else {
            dispatch(setShowCollapsedData(collapseDataProp));
        }
    }

    const handalModalSelectorChange = (selectedModel: string[] | string) => {
        // Implement modal selector change logic
        console.log('Selected Modal:', selectedModel);
        const userAction = conversationObjectUpdateTypes['MODEL_CHANGE'];
        setSelectedModel([String(selectedModel)])
        return dispatch(updateConversationObject(String(selectedConversation.conversationId), String(selectedModel), userAction, userId))
    };
    const SelectModelComponent = () => (
        <SelectDropdown
            componentName={'modalSelector'}
            placeholder={'Select Modal'}
            filterOptions={llmModels.map(llm => ({label: llm.ModelName, key: llm.modelValue, value: llm.modelValue}))}
            sortOptions={true}
            // defaultValue={[selectedConversation.selectedModel]}
            value={selectedModel}
            onChange={handalModalSelectorChange}
            selectionType={undefined}
            onBeforeChange={undefined}
            disabled={selectedConversation.conversationId === '0' ? true : false}
            showSelectAllOption={false}
            includeParentFilters={false}
            pageName={''}
            form={null}
            onScroll={undefined}
        />
    )

    const ItemsListContainer = () => (
        <ItemsListCard
            cardTitle="Conversations List"
            selectedConversationId={String(selectedConversation.conversationId) || ''}
            conversations={conversationsList.filter((conv: Conversation) => conv.isActive && !conv.isPinned)}
            onConversationClick={handleConversationNameClick}
        />
    )
    
    const PinnerItemsListContainer = () => (
        <ItemsListCard
            cardTitle='Pinned Conversations'
            selectedConversationId={String(selectedConversation.conversationId) || ''}
            conversations={conversationsList.filter((conv: Conversation) => conv.isPinned && conv.isActive)}
            onConversationClick={handleConversationNameClick}
        />
    )

    const handleConversationNameClick = (convObject: Conversation) => {
        if (isUserPromptFieldInActiveState) {
            return warningMessage(warningModalApiComponent, 'Please save/send the prompt message before selecting another conversation');
        }
        const conversationsListClonedIds = cloneDeep(messagesList).map(c => c.conversationId)
        dispatch(setSelectedConversation(convObject));
        if(!conversationsListClonedIds.includes(convObject.conversationId)){
            dispatch(getMessagesList(String(convObject.conversationId), false))
        }else{
            const convMessage = messagesList.find((msg: MessageWithConvId) => msg.conversationId === convObject.conversationId);
            if (convObject && (size(messagesList) > 0) && (!isUndefined(convMessage) && !isNull(convMessage))) {
                dispatch(setSelectedMessagesList(convMessage['messages']));
            }else{
                dispatch(setSelectedMessagesList([]));

            }
        }


    };
    
    const CollapsedDataContainer: React.FC<{ containerName: CollapsedDataContainerType }> = ({ containerName }) => (
        <>
        {containerName && 
        <Space className={`sidebar-animated ${containerName ? '': 'collapsed'} ${containerName === 'llm-selector' 
           ? 'llm-collapsed-data-container' : 'list-collapsed-data-container'}
        `}
        direction="vertical">
            {containerName === 'llm-selector' && <SelectModelComponent /> }
            {containerName === 'items-list-selector' && <ItemsListContainer/> }
            {containerName === 'pin-items-list-selector' && <PinnerItemsListContainer />}
        </Space>}
        </>
    );
    const sidebarButtonComponentList = [
        {id: 'model-selector-button', icon: <LLMFilledSVG />, onClickHandle: () => handleCollapsedDataVisibility('llm-selector')},
        {id: 'items-list-button', icon: <DropdownMenuFilledSVG />, onClickHandle: () => handleCollapsedDataVisibility('items-list-selector')},
        {id: 'pin-items-list-button', icon: <PushpinFilledSVG color='#ffffff' width="30" height="30"/>, onClickHandle: () => handleCollapsedDataVisibility('pin-items-list-selector')}
    ];
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
                            <SelectModelComponent />
                            <ItemsListContainer/>
                            <PinnerItemsListContainer />
                            {/* <PageHeading headingLevel={5} headingText={displayDateTimeMessage()} /> */}
                        </>
                    ) : (
                        <>
                            <CollapsedDataContainer
                                containerName={showCollapsedData}/>
                            {sidebarButtonComponentList
                                .filter((button) => button !== undefined)
                                .map((button) => (
                                    <ButtonComponent
                                        key={button.id}
                                        id={button.id}
                                        type="IconButton"
                                        icon={button.icon}
                                        onClickHandle={button.onClickHandle}
                                        style={{ border: 'none', background: 'transparent' }}
                                    />
                                ))}
                        </>
                    )}
                </Flex>
            </Content>
        </>
    );
};
