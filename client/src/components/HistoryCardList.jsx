import React, { useState } from "react";
import { Card, Dropdown, Button, Empty, List, Tooltip, Divider } from "antd";
import { ButtonComponent } from "./Button";
import './HistoryCardList.css'
import { PageHeading } from "./PageHeading";
import { GetInputField } from "./InputField";
import { EditFilledSVG } from "../assets/svg/EditFilledSVG";
import { DeleteOutlinedSVG } from "../assets/svg/DeleteOutlinedSVG";
import { DownloadOutlinedSVG } from "../assets/svg/DownloadOutlinedSVG";
import { EllipsisOutlinedSVG } from "../assets/svg/EllipseOutlinedSVG";
const HistoryCardList = ({ selectedConversation ,conversations }) => {
    const [convToRenameUsingId, setConvToRenameUsingId] = useState('');
    const handleRenameConversationTitle = (convId) => {
        return setConvToRenameUsingId(convId)
    }
    const handleDeleteConversation = (convId) => {

    }
    const handleExportConversation = (convId) => {

    }
    const handleConvTitleChange = (colName, convId, convIndex, convTitle) => {
        console.log(convTitle)
    }
    const menuOptions = (convId) => ([
        {label:(
            <ButtonComponent
                title='Rename'
                type="Button"
                icon={<EditFilledSVG/>}
                style={{border:'none', boxShadow:'none', minWidth:120}}
                onClickHandle={() => handleRenameConversationTitle(convId)}
            />
        ), key: 1},
        {label:(
            <ButtonComponent
                title='Delete'
                type="Button"
                icon={<DeleteOutlinedSVG/>}
                style={{border:'none', boxShadow:'none', minWidth:120}}
                onClickHandle={() => handleDeleteConversation(convId)}
            />
        ), key:2},
        {label:(
            <ButtonComponent
                title='Export'
                type="Button"
                icon={<DownloadOutlinedSVG />}
                style={{border:'none', boxShadow:'none', minWidth:120}}
                onClickHandle={() => handleExportConversation(convId)}
            />
        ), key:3},
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
                            actions={[
                                <Dropdown menu={{items: menuOptions(item.conversationId)}} >
                                    <Button icon={<EllipsisOutlinedSVG style={{color:"#fff"}}/>} type="text" />
                                </Dropdown>
                            ]}
                        >
                            {convToRenameUsingId === item.conversationId ? (
                                <GetInputField
                                    placeholder="New Title"
                                    colomnName=""
                                    onRowUpdate={handleConvTitleChange}
                                    inputType="text"
                                    key={item.conversationId}
                                    row={item.conversationId}
                                    rowIndex={index}
                                    selectedValue={item.conversationTitle}
                                    allowClear
                                    onClear={() => setConvToRenameUsingId('')}
                                    />
                            ) : (
                                <Tooltip title={item.conversationTitle} placement="right">
                                <List.Item.Meta className="history-textwrapper"
                                    title={item.conversationTitle} />
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
