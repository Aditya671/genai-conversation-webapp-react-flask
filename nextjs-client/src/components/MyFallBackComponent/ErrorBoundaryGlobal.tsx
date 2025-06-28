import React, { useState, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FallbackComponent} from './index';

interface ErrorBoundaryGlobalProps {
    children: ReactNode;
}

export const ErrorBoundaryGlobal: React.FC<ErrorBoundaryGlobalProps> = ({ children }) => {
    const [someKey, setSomeKey] = useState<null | string>(null);
    function logErrorToService(error: Error, info: { componentStack: string }) {
        // Use your preferred error logging service
        console.error('Caught an error:', error, info);
    }
    return (
        <ErrorBoundary
            onError={logErrorToService}
            FallbackComponent={FallbackComponent}
            onReset={() => setSomeKey(null)}
            resetKeys={[someKey]}
        >
            {children}
        </ErrorBoundary>
    );
};
