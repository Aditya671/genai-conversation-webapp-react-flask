import { Flex } from "antd"
import getInputField from "../../components/InputField"
import { ButtonComponent } from "../../components/Button"
import { SendOutlined } from '@ant-design/icons';
export const FoorterComponent = (props) => {
    
    return (
        <>
            <Flex>
            {getInputField()}
            <ButtonComponent tooltipText='Send Prompt' themeType='IconButton' icon={<SendOutlined />}/>
            </Flex>
        </>
    )
}