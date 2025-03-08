
import {
    Typography
} from 'antd';

export const PageHeading = ({
    headingText = '', headingLevel=3, ...rest
}) => {
    return (
        <>
            <Typography.Title
                className='theme-heading-font'
                style={{
                    color: '#f1f1f1', fontWeight: 700,
                    marginTop: 0, marginBottom: 2,
                    padding:'0 10px'
                }}
                {...rest}
                level={headingLevel}>
                {headingText}
            </Typography.Title>
        </>
    )
}
