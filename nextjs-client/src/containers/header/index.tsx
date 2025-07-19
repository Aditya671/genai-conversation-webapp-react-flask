import { Col, message, Row } from "antd";
import { ButtonComponent } from "../../components/Button";
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setConversationsList, setSelectedConversation } from "../../store/conversations/slice";
import { cloneDeep, isArray, size } from "lodash";
import { newConversationObject } from "../../helper/constants";
import { v4 as uuidv4 } from "uuid";
import { setSelectedMessagesList } from "../../store/messages/slice";
import { PageHeading } from "../../components/PageHeading";
import { useEffect, useState } from "react";
import { warningMessage } from "../../components/MessageModal";
import DotMenuSVG from "@/assets/svg/DotMenuSVG";
import EditChatSVG from "@/assets/svg/EditChatSVG";

export const HeaderComponent: React.FC = () => {
    const dispatch = useAppDispatch();
    const [warningModalApiComponent, contextHolder] = message.useMessage();

    const conversationsList = cloneDeep(useAppSelector((state) => state.conversations.conversationsList));
    const selectedConversation = cloneDeep(useAppSelector((state) => state.conversations.selectedConversation));
    const [displayedConvName, setDisplayedConversationName] = useState(selectedConversation['conversationTitle']);
    const isUserPromptFieldInActiveState = useAppSelector((state) => state.base.isUserPromptFieldInActiveState);

    useEffect(() => {
        if(selectedConversation){
            setDisplayedConversationName(selectedConversation['conversationTitle']);
        }
    }, [selectedConversation]);

    const generateNewChat = () => {
        if(isUserPromptFieldInActiveState){
            return warningMessage(warningModalApiComponent, 'Please save/send the prompt message before selecting another conversation');
        }
        const isConvList = isArray(conversationsList);
        const convSize = isConvList ? size(conversationsList) : 0;
        if(isConvList && convSize >= 1){
            const lastConv = conversationsList[convSize - 1];
            const isConvNew = lastConv['isNew'];
            if(isConvNew){
                return dispatch(setSelectedConversation(lastConv));
            }
        }
        const convObj = newConversationObject(uuidv4(), `Conversation-${new Date().toISOString()}`);
        dispatch(setConversationsList(
            [...conversationsList, convObj]
        ));
        dispatch(setSelectedMessagesList([]));
        return dispatch(setSelectedConversation(convObj));
    };
    return (
    <>
        {contextHolder}
        <Row>
            <Col span={22} style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <PageHeading
                    headingLevel={5} headingText={displayedConvName || ''}
                    style={{color:'#00000073', fontWeight: 500, marginTop: 0, marginBottom: 2}}
                />
            </Col>
            <Col span={2} style={{alignItems:'center', justifyContent:'flex-end', display:'flex'}}>
                <ButtonComponent
                    id='new-chat-button'
                    onClickHandle={generateNewChat}
                    style={{ background: 'transparent', border: 'none' }}
                    tooltipText='New Conversation' themeType='IconButton' icon={<EditChatSVG/>}
                />
                <ButtonComponent
                    id='header-menu-button'
                    onClickHandle={() => {}}
                    icon={<DotMenuSVG  /> }
                    themeType='IconButton'
                    style={{ background: 'transparent', border: 'none' }}
                />
            </Col>
        </Row>
    </>
    );
};
