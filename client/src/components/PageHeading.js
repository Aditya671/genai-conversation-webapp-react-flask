
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
                    color: '#0074e0', fontWeight: 700,
                    marginTop: 0, marginBottom: 18
                }}
                level={headingLevel}>
                {headingText}
            </Typography.Title>
        </>
    )
}
