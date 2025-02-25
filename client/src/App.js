import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import {Provider} from 'react-redux';
import { store } from "./store/store";
function App() {
  return (
    <>
        <Provider store={store}>
            <ConfigProvider locale={process.env.REACT_APP_LOCAL_LANGUAGE || enUS}>

            </ConfigProvider>
        </Provider>
    </>
  );
}

export default App;
