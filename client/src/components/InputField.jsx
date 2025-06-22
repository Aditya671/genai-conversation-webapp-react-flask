import { InputNumber, Input, DatePicker } from "antd"
import dayjs from 'dayjs'

/**
 * GetInputField
 *
 * Renders an input field based on the specified type.
 * Supports text, number, textarea, and date types.
 *
 * @param {string} inputType - Type of input to render ('text' | 'number' | 'textarea' | 'date').
 * @param {*} selectedValue - Default value for the input.
 * @param {*} userValue - Controlled value of the input.
 * @param {string} placeholder - Placeholder text for the input.
 * @param {object} row - Data row object to update.
 * @param {number} rowIndex - Index of the row being edited.
 * @param {string} colomnName - Name of the column being updated.
 * @param {boolean} isDisabled - Whether the input is disabled.
 * @param {function} onRowUpdate - Callback function to update the row.
 * @param {string} dateFormat - Format string for date input, e.g., 'MMM-DD-YYYY'.
 * @returns {JSX.Element} The corresponding input element.
 */

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
            <InputNumber
                id='number-input'
                style={{ width: "100%" }}
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
                id='text-input'
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
                id='text-area-input'
                defaultValue={selectedValue}
                value={userValue}
                placeholder={placeholder}
                className={"text-align-right"}
                type={"text"}
                status={!!row.isInValid ? 'error' : ''}
                controls={false}
                disabled={isDisabled}
                onChange={(e) => handleInputValueChange(e.target.value)}
                styles={{ textarea: { maxHeight: '10dvh', maxWidth: '75dvw' } }}
                {...rest}
            />
        )
    }
    if (inputType === 'date') {
        return (
            <DatePicker
                id='date-input'
                allowClear={false}
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