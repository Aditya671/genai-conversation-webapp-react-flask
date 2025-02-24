import { Button, ConfigProvider, Input, Space, theme } from "antd";
import enUS from "antd/es/locale/en_US";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { LayoutContainer } from "./containers/LayoutContainer";
import { FoorterComponent } from "./containers/footer";
import { HeaderComponent } from "./containers/header";
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
                        headerBg: '#d9d9d9',
                        bodyBg: '#d9d9d9',
                        footerBg: '#d9d9d9',
                        siderBg: '#f759ab',
                    },
                }
            }
            }
        >
            <LayoutContainer headerChildren={<HeaderComponent/>} footerChildren={<FoorterComponent/>}/>
        </ConfigProvider>
      </Provider>
    </>
  );
}

export default App;
