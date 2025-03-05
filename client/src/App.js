import { ConfigProvider } from "antd";
import enUS from "antd/es/locale/en_US";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { LayoutContainer } from "./containers/LayoutContainer";
import { FoorterComponent } from "./containers/footer";
import { HeaderComponent } from "./containers/header";
import { ContentComponent } from "./containers/content";
import { SidebarComponent } from "./containers/sidebar";
function App() {
    return (
        <>
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
                                colorBorderSecondary:  '#d9d9d9',
                                // colorBgContainer:'#434343',#434343a6
                                colorBgContainer:'#434343a6',
                                actionsLiMargin:'6px 0',
                                bodyPadding: '12px'
                            },
                        },
                    }}
                >
                    <LayoutContainer
                        leftSidebarContent={<SidebarComponent/>}
                        headerChildren={<HeaderComponent />}
                        contentChildren={<ContentComponent />}
                        footerChildren={<FoorterComponent />}
                    />
                </ConfigProvider>
            </Provider>
        </>
    );
}

export default App;
