import { Avatar, Card } from "antd"
import { messageAvatarSrcDefault } from "../helper/constants";
import Markdown from 'react-markdown'
import { Fragment } from "react";
const {Meta} = Card;

/**
 * MessageCard
 *
 * Displays a user message in a styled card with optional avatar, description,
 * actions, and additional information.
 *
 * @param {number} styleWidth - Minimum width of the card (default: 300).
 * @param {Array<React.ReactNode>} messageActions - List of action icons or buttons to show at the bottom of the card.
 * @param {string} messageAvatarSrc - URL for the avatar image.
 * @param {object} messageDescription - Object containing message content. Expects:
 *     - `element`: a React node (e.g., heading)
 *     - `desc`: markdown-formatted string
 * @param {string} messageSubDescription - A short plain-text description below the title.
 * @param {React.ReactNode|null} messageAdditionalInfo - Additional React content (e.g., image or banner) to be displayed above the card content.
 *
 * @returns {JSX.Element} A styled message card.
 */

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