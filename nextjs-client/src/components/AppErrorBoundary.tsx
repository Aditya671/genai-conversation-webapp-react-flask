import { Alert } from "antd";
import { errorMessage } from "../helper/constants";

const AppErrorBoundary = () => {
    return (
        <Alert.ErrorBoundary message={"Uh-oh!"} description={errorMessage} />
    );
};
export default AppErrorBoundary;
