import { Avatar, Card } from "antd"
import { messageAvatarSrcDefault } from "../helper/constants";
import Markdown from 'react-markdown'
import { Fragment } from "react";
const {Meta} = Card;

export const MessageCard = ({
    styleWidth=300,
    messageActions = [],
    messageAvatarSrc = messageAvatarSrcDefault,
    messageDescription = "This is a description",
    messageSubDescription = "This is a sub-description",
    messageAdditionalInfo = null
}) => {
    return (
    <>
    <Card
        loading={false}
        style={{
            minWidth: styleWidth,
            maxWidth:600
        }}
        size="small"
        cover={
            messageAdditionalInfo
        }
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
    )
}