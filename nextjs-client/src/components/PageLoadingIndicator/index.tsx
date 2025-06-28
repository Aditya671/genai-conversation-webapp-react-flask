import { Spin } from "antd";
import React from "react";
import  "./pageLoadingSpinIndicator.css";

export const PageLoadingIndicator: React.FC = () => {
    return (
        <div className='page-loading-indicator'>
            <Spin size='small' />
        </div>
    );
};
