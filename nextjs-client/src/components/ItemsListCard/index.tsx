import React, { useState } from "react";
import { Card, Dropdown, Empty, List, Tooltip, Space, Flex } from "antd";
import { cloneDeep } from "lodash";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ButtonComponent } from "../Button";
import './ItemsListCard.css';
import { PageHeading } from "../PageHeading";
import { GetInputField } from "../InputField";
import { Conversation } from "../../store/conversations/slice";
import {
    getConversationsList, updateConversationObject
} from "../../service/conversations-service";
import { conversationObjectUpdateTypes } from "../../helper/constants";
import PushpinFilledSVG from '../../assets/svg/PushpinFilledSVG';
import EditFilledSVG from '../../assets/svg/EditFilledSVG';
import DeleteOutlinedSVG from '../../assets/svg/DeleteOutlinedSVG';
import DownloadOutlinedSVG from '../../assets/svg/DownloadOutlinedSVG';
import EllipsisOutlinedSVG from '../../assets/svg/EllipseOutlinedSVG';
import TickSVG from '../../assets/svg/TickSVG';
import { BaseState, setConversationTitleEditingActiveState } from "@/store/base/slice";

interface ItemsListCardProps {
    cardTitle?: string;
    selectedConversationId: string;
    conversations: Conversation[];
    onConversationClick: (item: Conversation) => void;
}

const ItemsListCard: React.FC<ItemsListCardProps> = (
    { cardTitle, selectedConversationId, conversations, onConversationClick }
) => {
    const dispatch = useAppDispatch();
    const [convNewTitle, setConvNewTitle] = useState('');
    const userId = useAppSelector((state) => state.users.userId);
    const isConversationTitleEditingActive = useAppSelector((state: {base: BaseState}) => state.base.isConversationTitleEditingActive);

    const handleMenuItemClick = async (convId: string, userValue: string | boolean, action: string) => {
        const userAction = action || conversationObjectUpdateTypes['DEFAULT'];
        const convClone = cloneDeep(conversations);
        const convObjId = convClone.findIndex((c: Conversation) => c.conversationId === convId);
        let updatedValue = typeof(userValue) === "boolean" ? !userValue : userValue
        if (action === conversationObjectUpdateTypes['TITLE']) {
            updatedValue = isConversationTitleEditingActive.conversationTitle
            return dispatch(setConversationTitleEditingActiveState({isEditing:false, conversationId: '', conversationTitle: ''}))
        }
        if (action === conversationObjectUpdateTypes['EXPORT']) {
            // Export logic here
        }
        if (convObjId > -1) {
            dispatch(updateConversationObject(convId, updatedValue, userAction, userId))
        }
        return dispatch(getConversationsList(userId));
        // return true;
    };

    const menuOptions = (itemObj: Conversation) => ([
        {
            label: (
                <ButtonComponent
                    id={`pin-${itemObj.conversationId}`}
                    title={itemObj.isPinned ? "UnPin" : "Pin"}
                    type="Button"
                    icon={<PushpinFilledSVG />}
                    onClickHandle={() => handleMenuItemClick(String(itemObj.conversationId),
                        itemObj.isPinned, conversationObjectUpdateTypes['PIN'])}
                    style={{ border: 'none', boxShadow: 'none', minWidth: 120 }}
                />
            ), key: 1
        },
        {
            label: (
                <ButtonComponent
                    id={`rename-${itemObj.conversationId}`}
                    title="Rename"
                    type="Button"
                    icon={<EditFilledSVG />}
                    style={{ border: 'none', boxShadow: 'none', minWidth: 120 }}
                    onClickHandle={() => {
                        dispatch(setConversationTitleEditingActiveState(
                            {isEditing:true, conversationId: String(itemObj.conversationId), conversationTitle: convNewTitle}));
                        // setConvNewTitle(convTitle);
                    }}
                />
            ), key: 2
        },
        {
            label: (
                <ButtonComponent
                    id={`delete-${itemObj.conversationId}`}
                    title="Delete"
                    type="Button"
                    icon={<DeleteOutlinedSVG />}
                    style={{ border: 'none', boxShadow: 'none', minWidth: 120 }}
                    onClickHandle={() => handleMenuItemClick(String(itemObj.conversationId), '', conversationObjectUpdateTypes['DELETE'])}
                />
            ), key: 3
        },
        {
            label: (
                <ButtonComponent
                    id={`export-${itemObj.conversationId}`}
                    title="Export"
                    type="Button"
                    icon={<DownloadOutlinedSVG />}
                    style={{ border: 'none', boxShadow: 'none', minWidth: 120 }}
                    onClickHandle={() => handleMenuItemClick(String(itemObj.conversationId), String(itemObj.conversationId), conversationObjectUpdateTypes['EXPORT'])}
                />
            ), key: 4
        },
    ]);

    return (
        <>
            {conversations.length > 0 ? (
                <List
                    id="items-list"
                    className="items-list-container"
                    rowKey={(item) => item.conversationId}
                    loading={false}
                    bordered={true}
                    size="small"
                    header={
                        <PageHeading
                            headingText={`${cardTitle}${conversations.length > 0 ? ` (${conversations.length})` : ""}`}
                            headingLevel={5}
                        />
                    }
                    dataSource={conversations}
                    renderItem={(item: Conversation, index: number) => (
                        <List.Item
                            id={`items-list-item-${item.conversationId}`}
                            key={item.conversationId} style={{ color: '#f1f1f1' }}
                            styles={{ actions: { display: 'flex' } }}
                            actions={[
                                <Dropdown
                                    key={item.conversationId}
                                    menu={{ items: menuOptions(item) }}>
                                    <ButtonComponent
                                        style={{ background: 'transparent', border: 'none', color: "#fff" }}
                                        icon={<EllipsisOutlinedSVG />} type="text" onClickHandle={() => {}} />
                                </Dropdown>
                            ]}
                        >
                            {isConversationTitleEditingActive.conversationId === item.conversationId ? (
                                <Space.Compact
                                    style={{ background: '#fff', borderRadius: '3.5px' }}>
                                    <GetInputField
                                        id={`rename-conversation-${item.conversationId}`}
                                        placeholder="New Title"
                                        colomnName=""
                                        onRowUpdate={(colName, row, convIndex, convTitle) => setConvNewTitle(String(convTitle))}
                                        inputType="text"
                                        key={item.conversationId}
                                        row={item}
                                        rowIndex={index}
                                        selectedValue={item.conversationTitle}
                                        userValue={convNewTitle}
                                        allowClear
                                        onClear={() => dispatch(setConversationTitleEditingActiveState({isEditing: false, conversationId: '', conversationTitle: ''}))}
                                    />
                                    <ButtonComponent
                                        id={`rename-conversation-button-${item.conversationId}`}
                                        icon={<TickSVG />}
                                        onClickHandle={() => handleMenuItemClick(String(item.conversationId), convNewTitle, conversationObjectUpdateTypes['TITLE'])}
                                        style={{ background: 'transparent', border: 'none', color: "#fff" }}
                                        themeType='IconButton' />
                                </Space.Compact>
                            ) : (
                                <Tooltip
                                    // style={{ width: '100%' }}
                                    id={`items-list-item-tooltip-${item.conversationId}`}
                                    title={item.conversationTitle} placement="bottom">
                                    <span style={{width:'100%'}} onClick={() => onConversationClick(item)}>
                                    <List.Item.Meta
                                        key={`items-list-item-meta-${item.conversationId}`}
                                        className={`items-list-item-textwrapper ${selectedConversationId === item.conversationId ? 'selected' : ''}`}
                                        title={item.conversationTitle}
                                        description={null}
                                    />
                                    </span>
                                </Tooltip>
                            )}
                        </List.Item>
                    )} />
            ) : (
                <Card>
                    <Flex
                        id="items-list-empty" style={{height: "350px" }}
                        align="center" justify="center" 
                    >
                        <Empty description="No History" />
                    </Flex>
                </Card>
            )}
        </>
    );
};

export default ItemsListCard;
