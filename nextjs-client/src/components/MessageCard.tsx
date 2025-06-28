import { Avatar, Card } from "antd";
import { messageAvatarSrcDefault } from "../helper/constants";
import Markdown from 'react-markdown';
import { Fragment, ReactNode } from "react";
const { Meta } = Card;

export interface MessageDescription {
    element?: ReactNode;
    desc: string;
}

export interface MessageCardProps {
    styleWidth?: number;
    messageActions?: ReactNode[];
    messageAvatarSrc?: string;
    messageDescription?: MessageDescription;
    messageSubDescription?: string;
    messageAdditionalInfo?: ReactNode | null;
}

export const MessageCard: React.FC<MessageCardProps> = ({
    styleWidth = 300,
    messageActions = [],
    messageAvatarSrc = messageAvatarSrcDefault,
    messageDescription = { desc: "This is a description" },
    messageSubDescription = "This is a sub-description",
    messageAdditionalInfo = null
}) => {
    return (
        <>
            <Card
                loading={false}
                style={{
                    minWidth: styleWidth,
                    maxWidth: 600
                }}
                size="small"
                cover={messageAdditionalInfo}
                actions={messageActions}
            >
                <Meta
                    className="message-card-meta-white-space"
                    avatar={<Avatar src={messageAvatarSrc} />}
                    title={<Fragment>
                        {messageDescription.element}
                        <Markdown>{messageDescription.desc}</Markdown>
                    </Fragment>}
                    description={messageSubDescription}
                />
            </Card>
        </>
    );
};
