import { InputNumber, Input, DatePicker } from "antd";
import dayjs from 'dayjs';
import React from 'react';
import { Conversation } from "@/store/conversations/slice";
import { Message } from "@/store/messages/slice";

export type InputFieldType = 'text' | 'number' | 'textarea' | 'date';
export type RecordType = Record<string, string | number | boolean | Date>;
export type InputFieldValueType = string | number | Date | null | '' | undefined;
export interface GetInputFieldProps {
    inputType?:InputFieldType;
    selectedValue?: string | Date | number | undefined | null;
    userValue?: string | Date | number | null;
    placeholder?: string;
    row?: RecordType | Conversation | Message;
    rowIndex?: number;
    colomnName?: string;
    isDisabled?: boolean;
    onRowUpdate?: (
        colomnName: string, row: RecordType | Conversation | Message, rowIndex: number, value: InputFieldValueType
    ) => void;
    dateFormat?: string;
    [key: string]: unknown;
}

export const GetInputField: React.FC<GetInputFieldProps> = ({
    inputType = 'text',
    selectedValue = null,
    userValue = '',
    placeholder = 'Input Prompt...',
    row = {},
    rowIndex = 0,
    colomnName = '',
    isDisabled = false,
    onRowUpdate = undefined,
    dateFormat = 'MMM-DD-YYYY',
    ...rest
}) => {
    const handleInputValueChange = (value: InputFieldValueType) => {
        if (typeof onRowUpdate === 'function') {
            return onRowUpdate(colomnName, row, rowIndex, value);
        }
    };
    if (inputType === 'number') {
        return (
            <InputNumber
                id="number-input"
                style={{ width: "100%" }}
                defaultValue={Number(selectedValue)}
                value={Number(userValue)}
                className={"text-align-right"}
                min={0}
                type={"number"}
                controls={false}
                // status={row.isInValid ? 'error' : ''}
                onChange={handleInputValueChange}
                {...rest}
            />
        );
    }
    if (inputType === 'text') {
        return (
            <Input
                id="text-input"
                style={{ width: "100%" }}
                defaultValue={String(selectedValue)}
                value={String(userValue)}
                placeholder={placeholder}
                disabled={isDisabled}
                // status={row.isInValid ? 'error' : ''}
                onChange={e => handleInputValueChange(e.target.value)}
                {...rest}
            />
        );
    }
    if (inputType === 'textarea') {
        return (
            <Input.TextArea
                id="textarea-input"
                style={{ width: "100%" }}
                defaultValue={String(selectedValue)}
                value={String(userValue)}
                placeholder={placeholder}
                disabled={isDisabled}
                // status={row.isInValid ? 'error' : ''}
                onChange={e => handleInputValueChange(e.target.value)}
                {...rest}
            />
        );
    }
    if (inputType === 'date') {
        return (
            <DatePicker
                id="date-input"
                style={{ width: "100%" }}
                defaultValue={selectedValue ? dayjs(selectedValue) : undefined}
                value={userValue ? dayjs(userValue) : undefined}
                format={dateFormat}
                disabled={isDisabled}
                // status={row.isInValid ? 'error' : ''}
                onChange={(_, dateString) => handleInputValueChange(String(dateString))}
                {...rest}
            />
        );
    }
    return null;
};
