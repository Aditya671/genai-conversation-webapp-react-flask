import { Button, Space, Tooltip } from 'antd';
/**
 * ButtonComponent
 *
 * A reusable button component built with Ant Design.
 * Displays a tooltip on hover and supports loading state.
 *
 * @param {string} id - Unique identifier for the button.
 * @param {string} title - Button label text.
 * @param {string} tooltipText - Tooltip content shown on hover.
 * @param {boolean|null} loading - Whether the button shows a loading spinner.
 * @param {string} type - Ant Design button type (e.g., 'primary', 'dashed').
 * @param {string} themeType - Custom theme type to determine button style.
 * @param {function} onClickHandle - Callback function when the button is clicked.
 * @param {string} description - Accessible description for screen readers.
*/
export const ButtonComponent = (props) => {
    const {
        id = 'button', title = 'Button',
        tooltipText = '', loading = null,
        type, themeType = 'Button',
        onClickHandle, ...rest
    } = props;
    return (
        <Space wrap={true}>
            <Tooltip title={tooltipText} placement="bottom">
                <Button
                    id={`button-component-${id}}`}
                    aria-label={title}
                    role='button'
                    aria-describedby={title ? `button-desc-${id}` : undefined} // Optional, if you include a description below
                    loading={loading ?? false} // Ensures `loading` is boolean
                    aria-live="polite"
                    aria-busy={loading}
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