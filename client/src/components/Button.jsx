import React from 'react';
import { Button, Space, Tooltip } from 'antd';

export const ButtonComponent = (props) => {
    const { title = 'Button', tooltipText = '', loading = null, type, themeType = 'Button', onClickHandle, ...rest } = props;
    const buttonStype = themeType === 'Button' ? {
        opacity: 1,
        borderRadius: '3.5px',
        color: '#fff',
        fontSize: '16px',
        padding: '6px 8px',
        minWidth: 130,
    } : {
        backgroundColor: 'transparent', color: '#fff', fontSize: '14px',
        padding: '6px 8px', border: 'none', minWidth: 20,
        margin: '0px 0px 1px 0px', borderRadius: '3.5px',
        cursor: 'pointer'
    }
    return (
        <Space wrap={true}>
            <Tooltip title={tooltipText} placement="bottom">
                <Button
                    loading={(loading === null) ? null : loading}
                    type={(themeType === 'Button' || themeType === null) ? "primary" : type}
                    onClick={() => onClickHandle()}
                    size={'middle'}
                    style={buttonStype}
                    {...rest}>
                    {type === 'Button' ? title : null}
                </Button>
            </Tooltip>
        </Space>
    )
}