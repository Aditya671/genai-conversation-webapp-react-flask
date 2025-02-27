import {
    CopyFilled, CopyOutlined, 
    EditFilled, EditOutlined,
    SaveFilled, SaveOutlined
} from "@ant-design/icons"
import { Avatar, Card } from "antd"
import { PageLoadingIndicator } from "./PageLoadingSpinIndicator";
import { messageAvatarSrcDefault } from "../helper/constants";

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
            <CopyFilled key="copy" />,
            <EditFilled key="edit" />,
            <SaveFilled key="save" />,
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