import { Spin } from "antd";

/**
 * PageLoadingIndicator
 *
 * A full-height loading spinner component used to indicate
 * page-level loading states. Centered within its container.
 *
 * @returns {JSX.Element} A styled container with a centered Ant Design spinner.
 */

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