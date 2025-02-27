import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import { useSelector, useDispatch} from 'react-redux';
import { size } from 'lodash';

export const LayoutContainer = ({
    headerChildren,
    leftSidebarContent,
    contentChildren,
    rightSidebarContent,
    footerChildren,
}) => {
    const [collapsed, setCollapsed] = useState(false)
    const [siderWidth, setSiderWidth] = useState(280)
    const dispatch = useDispatch()
    const selectedConversationMessages = (useSelector((state) => state.messages.selectedConversationMessages))
    const contentCSS = size(selectedConversationMessages) === 0 ?
        {display:'flex', alignItems:'center', justifyContent:'center'} : {padding:'10px 20px', height:'fit-content', overflowY:'auto'}
   
    return (
    <>
        <Layout style={{height:'100dvh', maxHeight:'100dvh'}} hasSider={true}>
            <Sider width={siderWidth} breakpoint="sm" onBreakpoint={(broken) => broken ? setSiderWidth(180) : setSiderWidth(280)}
            trigger={null} collapsible collapsed={collapsed}>{leftSidebarContent}</Sider>
            <Layout>
                <Header style={{padding:'0 20px', height:'fit-content'}}>{headerChildren}</Header>
                <Content style={contentCSS}>{contentChildren}</Content>
                <Footer style={{padding:'10px 20px 20px 20px', margin:'0 auto', maxheight:'10dvh', height:'fit-content', width:'100%'}}>{footerChildren}</Footer>
            </Layout>

        </Layout>
    </>
  );
};
