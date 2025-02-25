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
        <Layout>
            <Header>{headerChildren}</Header>
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed}>{leftSidebarContent}</Sider>
                <Content>{contentChildren}</Content>
                <Sider>{rightSidebarContent}</Sider>
            </Layout>
            <Footer>{footerChildren}</Footer>
        </Layout>
    </>
  );
};
