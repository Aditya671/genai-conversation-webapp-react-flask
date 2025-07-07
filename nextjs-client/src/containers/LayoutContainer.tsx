import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState, ReactNode } from "react";
import { isArray, size } from 'lodash';
import { layoutCss } from './layoutCss';
import { BaseState, setSidebarCollapsedState } from "../store/base/slice";
import { MessagesState } from "../store/messages/slice";
import { UsersState } from "../store/users/slice";
import { ButtonComponent } from "../components/Button";
import LeftOutlinedSVG from '../assets/svg/LeftOutlinedSVG';
import RightOutlinedSVG from '../assets/svg/RightOutlinedSVG';
import { getConversationsList } from "@/service/conversations-service";
import { getLlmModelsList } from "@/service/llm-models-service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface LayoutContainerProps {
    headerChildren?: ReactNode;
    leftSidebarContent?: ReactNode;
    contentChildren?: ReactNode;
    rightSidebarContent?: ReactNode;
    footerChildren?: ReactNode;
}

export const LayoutContainer: React.FC<LayoutContainerProps> = ({
    headerChildren,
    leftSidebarContent,
    contentChildren,
    rightSidebarContent,
    footerChildren,
}) => {
    const [siderWidth, setSiderWidth] = useState(320);
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state: {users: UsersState}) => state.users.userId)
    const selectedConversationMessages = useAppSelector((state: {messages: MessagesState}) => state.messages.selectedConversationMessages);
    const isSidebarCollapsed = useAppSelector((state: {base: BaseState}) => state.base.isSidebarCollapsed ? state.base.isSidebarCollapsed : false);
    const contentCSS: React.CSSProperties = size(selectedConversationMessages) === 0
        ? { display: 'flex', alignItems: 'center', justifyContent: 'center' }
        : { padding: '10px', height: 'fit-content', overflowY: 'auto' };
    
    // Retrieve ConversationList 
    const conversationsList = useAppSelector((state) => state.conversations.conversationsList);
    useEffect(() => {
        if (isArray(conversationsList) && size(conversationsList) === 0) {
            dispatch(getConversationsList(userId))
        }
    }, [userId, conversationsList, dispatch]);

    const llmModelsList = useAppSelector((state) => state.base.llmModels);
    useEffect(() => {
        if (isArray(llmModelsList) && size(llmModelsList) === 0) {
            dispatch(getLlmModelsList())
        }
    }, [dispatch]);
    
    return (
        <Layout style={layoutCss.containerLayout} hasSider={true}>
            <Sider width={siderWidth} style={isSidebarCollapsed ? undefined : layoutCss.siderLayout}
                breakpoint="md" onBreakpoint={(broken) => broken ? setSiderWidth(200) : setSiderWidth(320)}
                trigger={null} collapsible collapsed={isSidebarCollapsed} >
                <ButtonComponent
                    style={{ position: 'absolute', top: 50, right: -25, borderRadius: '0 100% 100% 0', border: 'none', backgroundColor: '#1f1f1f' }}
                    id='collapse-sidebar'
                    icon={isSidebarCollapsed ? <LeftOutlinedSVG /> : <RightOutlinedSVG />}
                    tooltipText='Collapse Sidebar'
                    themeType='IconButton'
                    onClickHandle={() => dispatch(setSidebarCollapsedState(!isSidebarCollapsed))} />
                {leftSidebarContent}
                {rightSidebarContent}
            </Sider>
            <Layout>
                <Header style={layoutCss.headerLayout}>{headerChildren}</Header>
                <Content style={contentCSS}>{contentChildren}</Content>
                <Footer style={layoutCss.footerLayout}>{footerChildren}</Footer>
            </Layout>
        </Layout>
    );
};
