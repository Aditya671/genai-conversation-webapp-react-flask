import { Avatar, Card } from "antd"
import { messageAvatarSrcDefault } from "../helper/constants";
import { CopyFilledSVG } from "../assets/svg/CopyFilledSVG";
import { EditFilledSVG } from "../assets/svg/EditFilledSVG";
import { SaveFilledSVG } from "../assets/svg/SaveFilledSVG";
import { ButtonComponent } from "./Button";

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
    // <PageLoadingIndicator/>
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
            // style={{fontSize:12,}}
            avatar={<Avatar src={messageAvatarSrc} />}
            title={messageDescription}
            description={messageSubDescription}
        />
    </Card>
    </>
    )
}