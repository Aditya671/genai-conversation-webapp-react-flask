
import {
    Typography
} from 'antd';

export const PageHeading = ({
    headingText = '', headingLevel=3
}) => {
    return (
        <>
            <Typography.Title
                className='theme-heading-font'
                style={{
                    color: '#1f1f1f', fontWeight: 700,
                    marginTop: 0, marginBottom: 2
                }}
                level={headingLevel}>
                {headingText}
            </Typography.Title>
        </>
    )
}
