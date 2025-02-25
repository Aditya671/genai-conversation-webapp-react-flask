import React, { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";
import { MyFallbackComponent } from "./index";

export const ErrorBoundaryGlobal = ({ children }) => {
    const [someKey, setSomeKey] = useState(null)
    function logErrorToService(error, info) {
        // Use your preferred error logging service
        console.error("Caught an error:", error, info);
    }
    return (
        <ErrorBoundary onError={logErrorToService}
            FallbackComponent={MyFallbackComponent}
            onReset={() => setSomeKey(null)} // reset the state of your app here
            resetKeys={[someKey]} // reset the error boundary when `someKey` changes
        >
            {children}
        </ErrorBoundary>
    )
}