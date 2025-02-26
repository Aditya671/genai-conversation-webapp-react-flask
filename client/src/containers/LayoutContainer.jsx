import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import { useSelector, useDispatch} from 'react-redux';
import { setConversationsList } from "../store/conversations/slice";
import { newConversationObject } from "../helper/constants";
import { cloneDeep } from 'lodash';
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
    const conversationsList = useSelector((state) => state.conversations.conversationsList)

    useEffect(() => {
        if(Array.isArray(conversationsList) && conversationsList.length < 1){
            const convCloned = cloneDeep([...conversationsList, newConversationObject()])
            dispatch(setConversationsList(convCloned))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        
    }, [conversationsList])
    return (
    <>
        <Layout style={{height:'100dvh', maxHeight:'100dvh'}} hasSider={true}>
            <Sider width={siderWidth} breakpoint="sm" onBreakpoint={(broken) => broken ? setSiderWidth(180) : setSiderWidth(280)}
            trigger={null} collapsible collapsed={collapsed}>{leftSidebarContent}</Sider>
            <Layout>
                <Header style={{padding:'0 20px', height:'fit-content'}}>{headerChildren}</Header>
                <Content style={{padding:'10px 20px', height:'fit-content', overflowY:'auto'}}>{contentChildren}</Content>
                <Footer style={{padding:'10px 20px 20px 20px', margin:'0 auto', maxheight:'10dvh', height:'fit-content', width:'100%'}}>{footerChildren}</Footer>
            </Layout>

        </Layout>
    </>
  );
};
