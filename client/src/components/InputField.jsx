import { InputNumber, Input, DatePicker } from "antd"
import dayjs from 'dayjs'

export const GetInputField = ({
    inputType = 'text',
    selectedValue = null,
    userValue = null,
    placeholder = 'Input Prompt...',
    row = {},
    rowIndex = 0,
    colomnName = '',
    isDisabled = false,
    onRowUpdate = null,
    dateFormat = 'MMM-DD-YYYY',
    ...rest
}) => {
    const handleInputValueChange = (value) => {
        if (typeof onRowUpdate === 'function') {
            return onRowUpdate(colomnName, row, rowIndex, value)
        }
    }
    if (inputType === 'number') {
        return (
            <InputNumber style={{ width: "100%" }}
                defaultValue={selectedValue}
                value={userValue}
                className={"text-align-right"}
                min={0}
                type={"number"}
                controls={false}
                // disabled={isDisabled}
                status={!!row.isInValid ? 'error' : ''}
                onChange={(value) => handleInputValueChange(value)}
                {...rest}
            />)
    }
    if (inputType === 'text') {
        return (
            <Input
                defaultValue={selectedValue}
                value={userValue}
                placeholder={placeholder}
                className={"text-align-right"}
                type={"text"}
                status={!!row.isInValid ? 'error' : ''}
                controls={false}
                disabled={isDisabled}
                onChange={(e) => handleInputValueChange(e.target.value)}
                {...rest}
            />
        )
    }
    if (inputType === 'textarea') {
        return (
            <Input.TextArea
                defaultValue={selectedValue}
                value={userValue}
                placeholder={placeholder}
                className={"text-align-right"}
                type={"text"}
                status={!!row.isInValid ? 'error' : ''}
                controls={false}
                disabled={isDisabled}
                onChange={(e) => handleInputValueChange(e.target.value)}
                styles={{textarea:{maxHeight:'10dvh', maxWidth:'75dvw'}}}
                {...rest}
            />
        )
    }
    if (inputType === 'date') {
        return (
            <DatePicker allowClear={false}
                className={"text-align-right"}
                status={!!row.isInValid ? 'error' : ''}
                defaultValue={dayjs(selectedValue, dateFormat)}
                onChange={(value, dateString) => handleInputValueChange(dateString)}
                format={dateFormat}
                {...rest}
            />
        )
    }
}