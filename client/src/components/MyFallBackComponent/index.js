import { Col, Image, Layout, Row, Typography } from 'antd'
import { errorMessage } from '../../helper/constants'
import { ButtonComponent } from './../../components/Button'
import chatbotPreviewIcon from '../../chatbot-preview.png'
import { Content, Header, Footer } from 'antd/es/layout/layout';
import moment from 'moment';

const { Title } = Typography;
export const MyFallbackComponent = ({ error, resetErrorBoundary }) => {
    return (
        <Layout className="layout">
             <Header className='app-theme-gradient'
                style={{
                    display: 'flex',
                    minHeight:'10dvh',
                    paddingLeft: 0,
                    paddingRight: 0,
                    alignItems: 'center'
                }}
            >
                <Row align='middle' justify='space-between' style={{ width: '100%', padding: '8px 16px'}}>
                <Col span={2} >
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
                </Row>
            </Header>
            <Content
                style={{
                    padding: '0 20px',
                    minHeight: `calc(90dvh - 78px)`,
                    display: 'flex',
                    alignItems:'center',
                    justifyContent: 'center'
                }}
            >
                <Row align='middle' justify='center' style={{ width: '100%' }}>
                    <Col span={24} style={{ display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center', margin: '8px 4px' }}>
                        <Title level={2}>Uh-oh!</Title>
                        <Title level={4}>{errorMessage}</Title>
                        <ButtonComponent onClick={resetErrorBoundary} title={'Try Again'} loading={null}
                            style={{ background: '#0066a1' }} themeType="nav" />
                    </Col>
                </Row>
            </Content>
            <Footer className='app-theme-gradient'
                style={{
                    textAlign: 'right',
                    minHeight: '62px'
                }}
            >
                <Title level={4} style={{color:'#fff', margin:0}}>ConvBot © {moment().year()}</Title>
            </Footer>
        </Layout>
    )
}