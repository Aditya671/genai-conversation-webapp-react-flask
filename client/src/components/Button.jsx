import React from 'react';
import { Button, Space, Tooltip } from 'antd';

export const ButtonComponent = (props) => {
    const {
        title = 'Button', tooltipText = '', loading = null,
        type, themeType = 'Button',
        onClickHandle, ...rest
    } = props;
    return (
        <Space wrap={true}>
            <Tooltip title={tooltipText} placement="bottom">
                <Button
                    loading={(loading === null) ? null : loading}
                    iconPosition='end'
                    type={(themeType === 'Button' || themeType === null) ? "default" : type}
                    onClick={() => onClickHandle()}
                    size={'middle'}
                    // style={buttonStype}
                    {...rest}>
                    {type === 'Button' ? title : null}
                </Button>
            </Tooltip>
        </Space>
    )
}