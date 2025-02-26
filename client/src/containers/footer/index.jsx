import { Flex } from "antd"
import { GetInputField } from "../../components/InputField"
import { ButtonComponent } from "../../components/Button"
import { SendOutlined } from '@ant-design/icons';
export const FoorterComponent = (props) => {
    
    return (
        <>
            <Flex>
            <GetInputField maxLength={12000} inputType="textarea"/>
            <ButtonComponent tooltipText='Send Prompt' themeType='IconButton' icon={<SendOutlined />}/>
            </Flex>
        </>
    )
}