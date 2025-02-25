import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled, WarningFilled } from '@ant-design/icons';
import { Modal } from 'antd';

export const infoModal = (modalTitle, modalContent) => {
    Modal.info({
        title: modalTitle,
        icon: <InfoCircleFilled twoToneColor={"#1677ff"} style={{ fontSize: '18px' }} />,
        content: modalContent
    });
};

export const successModal = (modalTitle, modalContent) => {
    Modal.success({
        title: modalTitle,
        icon: <CheckCircleFilled twoToneColor={"#52c41a"} style={{ fontSize: '18px' }} />,
        content: modalContent,
    });
};

export const errorModal = (modalTitle, modalContent) => {
    Modal.error({
        title: modalTitle,
        icon: <CloseCircleFilled twoToneColor={'#ff4d4f'} style={{ fontSize: '18px' }} />,
        content: modalContent,
    });
};

export const warningModal = (modalTitle, modalContent) => {
    Modal.warning({
        title: modalTitle,
        icon: <WarningFilled twoToneColor={'#faad14'} style={{ fontSize: '18px' }} />,
        content: modalContent,
    });
};
