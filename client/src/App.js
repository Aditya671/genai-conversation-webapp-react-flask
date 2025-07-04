import { ConfigProvider } from "antd";
import enUS from "antd/es/locale/en_US";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { LayoutContainer } from "./containers/LayoutContainer";
import { FooterComponent } from "./containers/footer";
import { HeaderComponent } from "./containers/header";
import { ContentComponent } from "./containers/content";
import { SidebarComponent } from "./containers/sidebar";
import { ErrorBoundaryGlobal } from "./components/MyFallBackComponent/ErrorBoundaryGlobal";
function App() {
    return (
        <>
        <ErrorBoundaryGlobal children={
            <Provider store={store}>
                <ConfigProvider
                    locale={process.env.REACT_APP_LOCAL_LANGUAGE || enUS}
                    theme={{
                        // algorithm: [theme.compactAlgorithm],
                        components: {
                            Layout: {
                                headerBg: "#d9d9d9",
                                bodyBg: "#d9d9d9",
                                footerBg: "#d9d9d9",
                                siderBg: "#1f1f1f",
                            },
                            Card:{
                                colorTextDescription:'#ffffff',
                                colorTextHeading: '#ffffff',
                                // colorBorderSecondary:  '#d9d9d9', '#008080', #002140
                                // colorBgContainer:'#434343',#434343a6
                                colorBgContainer:'#3e3e3ee0',
                                actionsLiMargin:'6px 0',
                                bodyPadding: '12px'
                            },
                            Button:{
                                defaultBg:'#f1f1f1',
                                defaultColor:'#1f1f1f',
                                borderRadius:'3.5px',
                                padding: '6px 8px'
                            }
                        },
                    }}
                >
                    <LayoutContainer
                        leftSidebarContent={<SidebarComponent/>}
                        headerChildren={<HeaderComponent />}
                        contentChildren={<ContentComponent />}
                        footerChildren={<FooterComponent />}
                    />
                </ConfigProvider>
            </Provider>
        } />
        </>
    );
}

export default App;
