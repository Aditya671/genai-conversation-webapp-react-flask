import { Col, Layout, Row, Typography } from 'antd';
import { errorMessage } from '../../helper/constants';
import { ButtonComponent } from './../../components/Button';
import Image from 'next/image';
import moment from 'moment';
import React from 'react';
import { fallbackComponentCss } from './fallbackComponentCss';

const { Title } = Typography;

interface FallbackComponentProps {
    resetErrorBoundary: () => void;
}
const { Header, Content, Footer } = Layout;
export const FallbackComponent: React.FC<FallbackComponentProps> = (
    { resetErrorBoundary }
) => {
    return (
        <Layout className="layout">
            <Header className='app-theme-gradient'
                style={fallbackComponentCss.headerCss}
            >
                <Row align='middle' justify='space-between' style={{ width: '100%', padding: '8px 16px' }}>
                    <Col span={2} >
                        <Image alt="WebApp Logo" width={64} height={64} src="/chatbot-preview.png" />
                        <Title level={2}
                            className='theme-heading-font'
                            style={fallbackComponentCss.headerTitleCss}>
                                ConvBot
                        </Title>
                    </Col>
                </Row>
            </Header>
            <Content style={fallbackComponentCss.contentCss}>
                <Row align='middle' justify='center' style={{ width: '100%' }}>
                    <Col span={24} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '8px 4px' }}>
                        <Title level={2}>Uh-oh!</Title>
                        <Title level={4}>{errorMessage}</Title>
                        <ButtonComponent
                            id='try-again' onClickHandle={resetErrorBoundary}
                            title={'Try Again'} loading={null}
                            style={{ background: '#0066a1' }} themeType="nav"
                        />
                    </Col>
                </Row>
            </Content>
            <Footer
                className='app-theme-gradient'
                style={fallbackComponentCss.footerCss as React.CSSProperties}
            >
                © {moment().format('YYYY')} ConvBot
            </Footer>
        </Layout>
    );
};
