import { Content } from "antd/es/layout/layout"
import { PageHeading } from "../../components/PageHeading"
import { displayDateTimeMessage } from "../../utility/utility"


export const SidebarComponent = ({

}) => {

    return (
        <>
        <Content style={{maxHeight:'100%', padding:'20px 6px'}} >
            <PageHeading headingLevel={3} headingText={displayDateTimeMessage()} />
        </Content>
        </>
    )
}