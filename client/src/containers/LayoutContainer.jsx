import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";

export const LayoutContainer = ({
    headerChildren,
    leftSidebarContent,
    contentChildren,
    rightSidebarContent,
    footerChildren,
}) => {
    const [collapsed, setCollapsed] = useState(false)
    return (
    <>
        <Layout style={{height:'100dvh', maxHeight:'100dvh'}}>
            <Sider trigger={null} collapsible collapsed={collapsed}>{leftSidebarContent}</Sider>
            <Layout>
                <Header style={{padding:'0 20px', height:'fit-content'}}>{headerChildren}</Header>
                <Content style={{padding:'10px 20px', height:'fit-content', overflowY:'auto'}}>{contentChildren}</Content>
                <Footer style={{padding:'10px 20px 20px 20px', maxheight:'10dvh', height:'fit-content'}}>{footerChildren}</Footer>
            </Layout>

        </Layout>
    </>
  );
};
