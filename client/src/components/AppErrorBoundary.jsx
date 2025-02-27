import { Alert } from "antd";
import { errorMessage } from "../helper/constants.js";

const AppErrorBoundary = () => {
    return (
        <Alert.ErrorBoundary message={'Uh-oh!'} description={errorMessage} banner={true} />
    )
}
export default AppErrorBoundary;