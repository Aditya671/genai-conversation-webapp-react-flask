import { Spin } from "antd";

export const PageLoadingIndicator = () => {
    return (
        <div style={{
            padding: '0 10px',
            minHeight: `calc(90dvh - 72px)`,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex'
        }}><Spin indicator={'antIcon'} size='small' /></div>
    )
}