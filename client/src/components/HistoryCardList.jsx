import React, { useState } from "react";
import { Card, Dropdown, Button, Empty, List, Tooltip, Space } from "antd";
import { ButtonComponent } from "./Button";
import './HistoryCardList.css'
import { PageHeading } from "./PageHeading";
import { GetInputField } from "./InputField";
import { EditFilledSVG } from "../assets/svg/EditFilledSVG";
import { DeleteOutlinedSVG } from "../assets/svg/DeleteOutlinedSVG";
import { DownloadOutlinedSVG } from "../assets/svg/DownloadOutlinedSVG";
import { EllipsisOutlinedSVG } from "../assets/svg/EllipseOutlinedSVG";
import { setConversationsList, setSelectedConversation } from "../store/conversations/slice";
import { cloneDeep } from "lodash";
import { useDispatch } from "react-redux";
import { TickSVG } from "../assets/svg/TickSVG";
import { PushpinFilledSVG } from "../assets/svg/PushpinFilledSVG";


const HistoryCardList = ({ selectedConversation , conversations, onConversationClick }) => {
    const dispatch = useDispatch();
    const [convToRenameUsingId, setConvToRenameUsingId] = useState('');
    const [convNewTitle, setConvNewTitle] = useState('');
    
    
    const handleDeleteConversation = (convId) => {
        const convClone = cloneDeep(conversations);
        const convObj = convClone.filter(c => c.conversationId !== convId);
        dispatch(setConversationsList(convObj))
        if(convObj){
            const latestConversation = conversations.reduce((latest, current) => 
                new Date(current.dateTimeCreated) > new Date(latest.dateTimeCreated) ? current : latest
            )
            dispatch(
                setSelectedConversation({
                    conversationId: latestConversation['conversationId'],
                    conversationTitle : latestConversation['conversationTitle']
                })
            )
        }
    }
    const handleExportConversation = (convId) => {

    }
    
    const handleChangeConvTitle = () => {
        const convClone = cloneDeep(conversations);
        const convObj = convClone.find(c => c.conversationId === convToRenameUsingId);
        const convObjId = convClone.findIndex(c => c.conversationId === convToRenameUsingId);
        if (convObjId > -1){
            delete convClone[convObjId]
            const updatedConvObj = cloneDeep(convObj)
            updatedConvObj['conversationTitle'] = convNewTitle
            convClone[convObjId] = updatedConvObj
            dispatch(setConversationsList(convClone))
        }
        setConvToRenameUsingId('')
    }
    const menuOptions = (convId) => ([
        {label: (
            <ButtonComponent
                title='Pin'
                type="Button"
                icon={<PushpinFilledSVG/>} 
                onClickHandle={() => () => true}
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
                onClickHandle={() => setConvToRenameUsingId(convId)}
            />
        ), key: 2},
        {label:(
            <ButtonComponent
                title='Delete'
                type="Button"
                icon={<DeleteOutlinedSVG/>}
                style={{border:'none', boxShadow:'none', minWidth:120}}
                onClickHandle={() => handleDeleteConversation(convId)}
            />
        ), key:3},
        {label:(
            <ButtonComponent
                title='Export'
                type="Button"
                icon={<DownloadOutlinedSVG />}
                style={{border:'none', boxShadow:'none', minWidth:120}}
                onClickHandle={() => handleExportConversation(convId)}
            />
        ), key:4},
    ]);

    return (
        <>
            {conversations.length > 0 ? (
                <List
                    style={{width:'100%'}}
                    // grid={{column:1}}
                    size="small"
                    bordered
                    header={<>
                        <PageHeading
                            style={{color:'#008080', marginTop: 0, marginBottom: 2}}
                            headingText={`History${conversations.length > 0 ? ` (${conversations.length})` : ""}`}
                            headingLevel={3}
                        />
                        
                    </>}
                    dataSource={conversations}
                    // style={{ite}}
                    renderItem={(item, index) => (
                        <List.Item
                            key={item.conversationId} style={{color:'#f1f1f1'}}
                            styles={{actions:{display:'flex'}}}
                            actions={[                                
                                <Dropdown menu={{items: menuOptions(item.conversationId)}} >
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
                                        allowClear
                                        onClear={() => setConvToRenameUsingId('')}
                                    />
                                    <ButtonComponent icon={<TickSVG/>} 
                                        onClickHandle={handleChangeConvTitle}
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
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
                        <Empty description="No History" />
                    </div>
                </Card>
            )}
        </>
    );
};

export default HistoryCardList;
