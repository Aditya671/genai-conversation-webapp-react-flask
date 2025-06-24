import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import { useSelector, useDispatch} from 'react-redux';
import { isArray, size } from 'lodash';
// import { getConversationsList } from "../service/conversation-list";
import { layoutCss } from './layoutCss.jsx';
import { setConversationsList } from "../store/conversations/slice.js";
import { setSidebarCollapsedState } from "../store/base/slice.js";
import { conversationsListSampleData, messagesList2SampleData } from "../sample_data.js";
import { setMessagesList } from "../store/messages/slice.js";
import { ButtonComponent } from "../components/Button.jsx";
import { LeftOutlinedSVG } from "../assets/svg/LeftOutlinedSVG.jsx";
import { RightOutlinedSVG } from "../assets/svg/RightOutlinedSVG.jsx";

export const LayoutContainer = ({
    headerChildren,
    leftSidebarContent,
    contentChildren,
    rightSidebarContent,
    footerChildren,
}) => {
    const [siderWidth, setSiderWidth] = useState(320)
    
    const dispatch = useDispatch();
    const selectedConversationMessages = (useSelector((state) => state.messages.selectedConversationMessages))
    const isSidebarCollapsed = useSelector((state) => state.base.isSidebarCollapsed ? state.base.isSidebarCollapsed : false)
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
        {/* <style>
            {`
#button-component-collape-sidebar {
  position: relative;
  padding: 1em 2em;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 0;
  cursor: pointer;
  overflow: hidden;
}
#button-component-collape-sidebar::before,
#button-component-collape-sidebar::after {
  content: '';
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: inherit;
  z-index: 0;
}

#button-component-collape-sidebar::before {
  top: -25px;
  left: -25px;
  border-radius: 0 0 100% 0;
}

#button-component-collape-sidebar::after {
  bottom: -25px;
  right: -25px;
  border-radius: 100% 0 0 0;
}

            `}
        </style> */}
        <Layout style={layoutCss.containerLayout} hasSider={true}>
            <Sider width={siderWidth} style={layoutCss.siderLayout}
                breakpoint="md" onBreakpoint={(broken) => broken ? setSiderWidth(200) : setSiderWidth(320)}
                trigger={null} collapsible collapsed={isSidebarCollapsed} >
                    <ButtonComponent
                        style={{position:'absolute', top:10, right:-25,borderRadius:'0 100% 100% 0', border:'none', backgroundColor:'#1f1f1f'}}
                        id = 'collape-sidebar'
                        icon={isSidebarCollapsed ? <LeftOutlinedSVG /> : <RightOutlinedSVG />}
                        tooltipText='Collapse Sidebar'
                        themeType='IconButton'
                        onClickHandle={() => setSidebarCollapsedState(!isSidebarCollapsed)} />
                        {leftSidebarContent}
            </Sider>
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
