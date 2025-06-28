import { Modal } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import InfoCircleFilledSVG from '../assets/svg/InfoCircleFilledSVG';
import { CheckCircleFilledSVG } from '../assets/svg/CheckCircleFilledSVG';
import CloseCircleFilledSVG from '../assets/svg/CloseCircleFilledSVG';
import WarningFilledSVG from '../assets/svg/WarningFilledSVG';

export const infoModal = (modalTitle: string, modalContent: React.ReactNode) => {
    Modal.info({
        title: modalTitle,
        icon: <InfoCircleFilledSVG />,
        content: modalContent
    });
};

export const successModal = (modalTitle: string, modalContent: React.ReactNode) => {
    Modal.success({
        title: modalTitle,
        icon: <CheckCircleFilledSVG />,
        content: modalContent,
    });
};

export const errorModal = (modalTitle: string, modalContent: React.ReactNode) => {
    Modal.error({
        title: modalTitle,
        icon: <CloseCircleFilledSVG />,
        content: modalContent,
    });
};

export const warningModal = (modalTitle: string, modalContent: React.ReactNode) => {
    Modal.warning({
        title: modalTitle,
        icon: <WarningFilledSVG />,
        content: modalContent,
    });
};

export const successMessage = (successMessageApiComponent: MessageInstance, content: React.ReactNode) => {
    successMessageApiComponent.open({
        type: 'success',
        content: content,
        duration: 3,
    });
};
export const errorMessage = (errorMessageApiComponent: MessageInstance, content: React.ReactNode) => {
    errorMessageApiComponent.open({
        type: 'error',
        content: content,
        duration: 3,
    });
};
export const warningMessage = (warningModalApiComponent: MessageInstance, content: React.ReactNode) => {
    warningModalApiComponent.open({
        type: 'warning',
        content: content,
        duration: 3,
    });
};
