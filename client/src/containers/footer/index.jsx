import { Flex } from "antd"
import { GetInputField } from "../../components/InputField"
import { ButtonComponent } from "../../components/Button";
import { SendOutlinedSVG } from "../../assets/svg/SendOutlinedSVG";
import { useState } from "react";
import { errorModal } from "../../components/MessageModal";
export const FoorterComponent = (props) => {
    const [userInput, setUserInput] = useState('')
    const handleUserPrompt = (colomnName, row, rowIndex, promptMessage) => {
        setUserInput(promptMessage)
    }
    const handleSendPromptClick = () => {
        if(!userInput){
            return errorModal('User Prompt', 'Please enter prompt message')
        }
        
    }
    return (
        <>
            <Flex>
            <GetInputField maxLength={12000} inputType="textarea" colomnName="UserPrompt" onRowUpdate={handleUserPrompt}/>
            <ButtonComponent tooltipText='Send Prompt' themeType='IconButton' icon={<SendOutlinedSVG />}
                onClickHandle={handleSendPromptClick}
            />
            </Flex>
        </>
    )
}