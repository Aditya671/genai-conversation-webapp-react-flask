import { InputNumber, Input, DatePicker } from "antd"
import dayjs from 'dayjs'

const getInputField = (inputType = 'text',
    selectedValue = null,
    placeholder = 'Input Prompt...',
    row = {},
    rowIndex = 0,
    colomnName = '',
    isDisabled = false,
    onRowUpdate = null,
    dateFormat = 'MMM-DD-YYYY'
) => {
    const handleInputValueChange = (value) => {
        if (typeof onRowUpdate === 'function') {
            return onRowUpdate(colomnName, row, rowIndex, value)
        }
    }
    if (inputType === 'number') {
        return (
            <InputNumber style={{ width: "100%" }}
                defaultValue={selectedValue}
                value={selectedValue}
                className={"text-align-right"}
                min={0}
                type={"number"}
                controls={false}
                // disabled={isDisabled}
                status={!!row.isInValid ? 'error' : ''}
                onChange={(value) => handleInputValueChange(value)}
            />)
    }
    if (inputType === 'text') {
        return (
            <Input
                defaultValue={selectedValue}
                placeholder={placeholder}
                className={"text-align-right"}
                type={"text"}
                status={!!row.isInValid ? 'error' : ''}
                controls={false}
                disabled={isDisabled}
                onChange={(e) => handleInputValueChange(e.target.value)}
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
            />
        )
    }
}
export default getInputField;