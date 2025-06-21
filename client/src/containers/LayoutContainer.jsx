import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import { useSelector, useDispatch} from 'react-redux';
import { isArray, size } from 'lodash';
// import { getConversationsList } from "../service/conversation-list";
import { layoutCss } from './layoutCss.jsx';
import { setConversationsList } from "../store/conversations/slice.js";
import { conversationsListSampleData, messagesList2SampleData } from "../sample_data.js";
import { setMessagesList } from "../store/messages/slice.js";

export const LayoutContainer = ({
    headerChildren,
    leftSidebarContent,
    contentChildren,
    rightSidebarContent,
    footerChildren,
}) => {
    const [collapsed, setCollapsed] = useState(false)
    const [siderWidth, setSiderWidth] = useState(320)
    
    const dispatch = useDispatch();
    const selectedConversationMessages = (useSelector((state) => state.messages.selectedConversationMessages))

    const contentCSS = size(selectedConversationMessages) === 0 ?
        {display:'flex', alignItems:'center', justifyContent:'center'} :
        {padding:'10px', height:'fit-content', overflowY:'auto'};
    
    const conversationsList = (useSelector((state) => state.conversations.conversationsList))
    useEffect(() => {
        if(isArray(conversationsList) && size(conversationsList) === 0) {
            // dispatch(getConversationsList('aditya.gupta671@gmail.com'))
            dispatch(setConversationsList(conversationsListSampleData));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationsList])
    const messagesList = useSelector((state) => state.messages.messagesList)

    useEffect(() => {
        if(isArray(messagesList) && size(messagesList) === 0) {
            // dispatch(getConversationsList('aditya.gupta671@gmail.com'))
            dispatch(setMessagesList(messagesList2SampleData));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationsList])
    
    return (
    <>
        <Layout style={layoutCss.containerLayout} hasSider={true}>
            <Sider width={siderWidth} breakpoint="md" onBreakpoint={(broken) => broken ? setSiderWidth(200) : setSiderWidth(320)}
            trigger={null} collapsible collapsed={collapsed}>{leftSidebarContent}</Sider>
            <Layout>
                <Header style={layoutCss.headerLayout}>{headerChildren}</Header>
                <Content style={contentCSS}>{contentChildren}</Content>
                <Footer
                    style={layoutCss.footerLayout}>{footerChildren}</Footer>
            </Layout>

        </Layout>
    </>
  );
};
