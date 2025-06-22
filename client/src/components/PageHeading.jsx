
import { Typography } from 'antd';

/**
 * PageHeading
 *
 * A simple reusable heading component using Ant Design's Typography.
 * Useful for consistent page section titles with theme styling.
 *
 * @param {string} headingText - The text to display as the heading.
 * @param {1|2|3|4|5} headingLevel - The heading level (h1 to h5), passed as AntD `level` prop.
 * @param {object} rest - Additional props forwarded to Typography.Title (e.g. `style`, `id`, etc.).
 *
 * @returns {JSX.Element} A styled page heading element.
 */

export const PageHeading = ({ headingText = '', headingLevel = 3, ...rest }) => {
    return (
        <>
            <Typography.Title
                className='theme-heading-font'
                style={{
                    color: '#f1f1f1', fontWeight: 700,
                    marginTop: 0, marginBottom: 2,
                    padding: '0 10px'
                }}
                {...rest}
                level={headingLevel}>
                {headingText}
            </Typography.Title>
        </>
    )
}
