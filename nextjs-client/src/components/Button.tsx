import { Button, Space, Tooltip } from 'antd';
import React from 'react';

interface ButtonComponentProps {
    id?: string;
    title?: string;
    tooltipText?: string;
    loading?: boolean | null;
    type?: string;
    themeType?: string | null;
    onClickHandle: () => void;
    description?: string;
    [key: string]: unknown;
}

export const ButtonComponent: React.FC<ButtonComponentProps> = ({
    id = 'button',
    title = 'Button',
    tooltipText = '',
    loading = null,
    type,
    themeType = 'Button',
    onClickHandle,
    ...rest
}) => {
    return (
        <Space wrap={true}>
            <Tooltip title={tooltipText} placement="bottom">
                <Button
                    id={`button-component-${id}`}
                    aria-label={title}
                    role="button"
                    aria-describedby={title ? `button-desc-${id}` : undefined}
                    loading={loading ?? false}
                    aria-live="polite"
                    aria-busy={loading ?? false}
                    type={
                        themeType === 'Button' || themeType === null
                            ? "default"
                            : (["default", "primary", "dashed", "link", "text"].includes(themeType)
                                ? themeType as "default" | "primary" | "dashed" | "link" | "text"
                                : "default")
                    }
                    onClick={() => onClickHandle()}
                    size={'middle'}
                    {...rest}
                >
                    {type === 'Button' ? title : null}
                </Button>
            </Tooltip>
        </Space>
    );
};
