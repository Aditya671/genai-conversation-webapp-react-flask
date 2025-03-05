import React from "react";
import { Card, Dropdown, Button, Empty, List } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { ButtonComponent } from "./Button";

const HistoryCardList = ({ conversations }) => {
    const menu = [
        {label:(<ButtonComponent title='Rename' type="Button"/>), key: 1},
        {label:(<ButtonComponent title='Delete' type="Button"/>), key:2},
        {label:(<ButtonComponent title='Export' type="Button"/>), key:3},
    ];

    return (
        <>
            {conversations.length > 0 ? (
                <List
                    size="small"
                    bordered
                    header={`History${conversations.length > 0 ? ` (${conversations.length})` : ""}`}
                    dataSource={conversations}
                    // style={{ite}}
                    renderItem={(item) => (
                        <List.Item
                            key={item.conversationId}
                            actions={[
                                <Dropdown menu={{items: menu}} >
                                    <Button icon={<EllipsisOutlined />} type="text" />
                                </Dropdown>
                            ]}
                        >
                            <List.Item.Meta
                                title={item.conversationTitle} />
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
