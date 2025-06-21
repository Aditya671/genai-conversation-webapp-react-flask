import React, { useState } from "react";
import { Card, Dropdown, Empty, List, Tooltip, Space } from "antd";
import { cloneDeep } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { ButtonComponent } from "../Button";
import './HistoryCardList.css'
import { PageHeading } from "../PageHeading";
import { GetInputField } from "../InputField";
import { setConversationsList, setSelectedConversation } from "../../store/conversations/slice";
import { TickSVG } from "../../assets/svg/TickSVG";
import { PushpinFilledSVG } from "../../assets/svg/PushpinFilledSVG";
import { EditFilledSVG } from "../../assets/svg/EditFilledSVG";
import { DeleteOutlinedSVG } from "../../assets/svg/DeleteOutlinedSVG";
import { DownloadOutlinedSVG } from "../../assets/svg/DownloadOutlinedSVG";
import { EllipsisOutlinedSVG } from "../../assets/svg/EllipseOutlinedSVG";
import { getConversationsList, updateConversationObject } from "../../service/conversation-list";
import { conversationObjectUpdateTypes } from "../../helper/constants";

const HistoryCardList = ({ selectedConversation , conversations, onConversationClick }) => {
    const dispatch = useDispatch();
    const [convToRenameUsingId, setConvToRenameUsingId] = useState('');
    const [convNewTitle, setConvNewTitle] = useState('');
    const userId  = useSelector((state) => state.users.userId);
    
    const handleMenuItemClick = async (convId, convTitle, action) => {
        if(action === conversationObjectUpdateTypes['PIN']){
            await dispatch(updateConversationObject(convId, '', conversationObjectUpdateTypes['PIN']))
        }
        if(action === conversationObjectUpdateTypes['DELETE']){
            await dispatch(updateConversationObject(convId, '', conversationObjectUpdateTypes['DELETE']))
        }
        if(action === conversationObjectUpdateTypes['TITLE']){
            const convClone = cloneDeep(conversations);
            const convObj = convClone.find(c => c.conversationId === convId);
            const convObjId = convClone.findIndex(c => c.conversationId === convId);
            if (convObjId > -1){
                await dispatch(updateConversationObject(convId, convTitle, conversationObjectUpdateTypes['TITLE']))
            }
            setConvToRenameUsingId('')
        }
        if(action === conversationObjectUpdateTypes['EXPORT']){
            
        }
        await dispatch(getConversationsList(userId))
        return true
    }

    const menuOptions = (convId, convTitle) => ([
        {label: (
            <ButtonComponent
                title='Pin'
                type="Button"
                icon={<PushpinFilledSVG/>} 
                onClickHandle={() => handleMenuItemClick(convId, convTitle, conversationObjectUpdateTypes['PIN'])}
                style={{border:'none', boxShadow:'none', minWidth:120}}
            />
        ), key:1},
        {
            label:(
            <ButtonComponent
                title='Rename'
                type="Button"
                icon={<EditFilledSVG/>}
                style={{border:'none', boxShadow:'none', minWidth:120}}
                onClickHandle={() => {setConvToRenameUsingId(convId); setConvNewTitle(convTitle)}}
            />
        ), key: 2},
        {label:(
            <ButtonComponent
                title='Delete'
                type="Button"
                icon={<DeleteOutlinedSVG/>}
                style={{border:'none', boxShadow:'none', minWidth:120}}
                onClickHandle={() => handleMenuItemClick(convId, '', conversationObjectUpdateTypes['DELETE'])}
            />
        ), key:3},
        {label:(
            <ButtonComponent
                title='Export'
                type="Button"
                icon={<DownloadOutlinedSVG />}
                style={{border:'none', boxShadow:'none', minWidth:120}}
                onClickHandle={() => handleMenuItemClick(convId, '', conversationObjectUpdateTypes['EXPORT'])}
            />
        ), key:4},
    ]);

    return (
        <>
            {conversations.length > 0 ? (
                <List
                    rowKey={(item) => item.conversationId}
                    style={{width:'100%', overflowY:'auto', overflowX:'hidden', height:'500px'}}
                    loading={false}
                    bordered={true}
                    size="small"
                    // bordered
                    header={
                        <PageHeading
                            style={{color:'#008080', marginTop: 0, marginBottom: 2}}
                            headingText={`History${conversations.length > 0 ? ` (${conversations.length})` : ""}`}
                            headingLevel={3}
                        />
                    }
                    dataSource={conversations}
                    // style={{ite}}
                    renderItem={(item, index) => (
                        <List.Item
                            key={item.conversationId} style={{color:'#f1f1f1'}}
                            styles={{actions:{display:'flex'}}}
                            actions={[                                
                                <Dropdown menu={{items: menuOptions(item.conversationId, item.conversationTitle)}} >
                                    <ButtonComponent
                                    style={{background:'transparent', border:'none', color:"#fff"}}
                                    icon={<EllipsisOutlinedSVG style={{color:"#fff"}}/>} type="text" />
                                </Dropdown>
                            ]}
                        >
                            {convToRenameUsingId === item.conversationId ? (
                                <Space.Compact
                                    onConversationClick
                                    style={{background:'#fff', borderRadius:'3.5px'}}>
                                    <GetInputField
                                        placeholder="New Title"
                                        colomnName=""
                                        onRowUpdate={(colName, row, convIndex, convTitle) => setConvNewTitle(convTitle)}
                                        inputType="text"
                                        key={item.conversationId}
                                        row={item}
                                        rowIndex={index}
                                        selectedValue={item.conversationTitle}
                                        userValue={convNewTitle}
                                        allowClear
                                        onClear={() => setConvToRenameUsingId('')}
                                    />
                                    <ButtonComponent icon={<TickSVG/>}
                                        onClickHandle={() => handleMenuItemClick(convToRenameUsingId, convNewTitle, conversationObjectUpdateTypes['TITLE'])}
                                        style={{background:'transparent', border:'none', color:"#fff"}}
                                        themeType='IconButton' />
                                    </Space.Compact>
                            ) : (
                                <Tooltip title={item.conversationTitle} placement="bottom">
                                <List.Item.Meta className="history-textwrapper"
                                    title={item.conversationTitle} onClick={() => onConversationClick(item)} />
                                </Tooltip>
                            )}

                        </List.Item>
                    )} />
            ) : (
                <Card>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "350px" }}>
                        <Empty description="No History" />
                    </div>
                </Card>
            )}
        </>
    );
};

export default HistoryCardList;
