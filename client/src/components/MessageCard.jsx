import { Avatar, Card } from "antd"
import { PageLoadingIndicator } from "./PageLoadingSpinIndicator";
import { messageAvatarSrcDefault } from "../helper/constants";
import { CopyFilledSVG } from "../assets/svg/CopyFilledSVG";
import { EditFilledSVG } from "../assets/svg/EditFilledSVG";
import { SaveFilledSVG } from "../assets/svg/SaveFilledSCG";

const {Meta} = Card;

export const MessageCard = ({
    styleWidth=300,
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
            width: styleWidth,
        }}
        size="small"
        cover={
            messageAdditionalInfo
        }
        actions={[
            <CopyFilledSVG key="copy" />,
            <EditFilledSVG key="edit" />,
            <SaveFilledSVG key="save" />,
        ]}
    >
        <Meta
            avatar={<Avatar src={messageAvatarSrc} />}
            title={messageDescription}
            description={messageSubDescription}
        />
    </Card>
    </>
    )
}