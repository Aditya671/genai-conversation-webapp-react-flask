import React from "react";
import { Card, Dropdown, Button, Empty, List, Tooltip, Divider } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { ButtonComponent } from "./Button";
import './HistoryCardList.css'
import { PageHeading } from "./PageHeading";
const HistoryCardList = ({ selectedConversation ,conversations }) => {
    const menu = [
        {label:(<ButtonComponent title='Rename' type="Button"/>), key: 1},
        {label:(<ButtonComponent title='Delete' type="Button"/>), key:2},
        {label:(<ButtonComponent title='Export' type="Button"/>), key:3},
    ];

    return (
        <>
            {conversations.length > 0 ? (
                <List
                    style={{width:'100%'}}
                    // grid={{column:1}}
                    size="small"
                    bordered
                    header={<><PageHeading
                        style={{color:'#f1f1f1', marginTop: 0, marginBottom: 2}}
                        headingText={`History${conversations.length > 0 ? ` (${conversations.length})` : ""}`}
                        headingLevel={3}
                    /><Divider style={{background:'#f1f1f1', margin:'2px'}}/> </>}
                    dataSource={conversations}
                    // style={{ite}}
                    renderItem={(item) => (
                        <List.Item
                            key={item.conversationId} style={{color:'#f1f1f1'}}
                            actions={[
                                <Dropdown menu={{items: menu}} >
                                    <Button icon={<EllipsisOutlined />} type="text" />
                                </Dropdown>
                            ]}
                        >
                            <Tooltip title={item.conversationTitle} placement="right">
                            <List.Item.Meta className="history-textwrapper"
                                title={item.conversationTitle} />
                                </Tooltip>
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
