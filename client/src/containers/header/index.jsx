import { Col, Flex, Image, Row } from "antd"
import chatbotPreviewIcon from '../../chatbot-preview.png'
import Title from "antd/es/typography/Title"

export const HeaderComponent = (props) => {
    return (
    <>
        <Row>
        {/* <Flex gap='medium' wrap='wrap' align="center" justify="space-between" > */}
            <Col span={3} >
                <Image alt="WebApp Logo" width={64} src={chatbotPreviewIcon}/>
                <Title level={2}
                    className='theme-heading-font'
                    style={{
                        color: '#1f1f1f',
                        fontWeight: 'bold',
                        margin: '0 0 0 8px',
                        fontSize: '12px',
                    }} >ConvBot</Title>
            </Col>
            <Col span={15} ></Col>
            <Col span={6} ></Col>
        {/* </Flex> */}
        </Row>
    </>
    )
}