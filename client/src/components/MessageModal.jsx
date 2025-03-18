import { Modal } from 'antd';
import { InfoCircleFilledSVG } from '../assets/svg/InfoCircleFilledSVG';
import { CheckCircleFilledSVG } from '../assets/svg/CheckCircleFilledSVG';
import { WarningFilledSVG } from '../assets/svg/WarningFilledSVG';
import { CloseCircleFilledSVG } from '../assets/svg/CloseCircleFilledSVG';

export const infoModal = (modalTitle, modalContent) => {
    Modal.info({
        title: modalTitle,
        icon: <InfoCircleFilledSVG twoToneColor={"#1677ff"} style={{ fontSize: '18px' }} />,
        content: modalContent
    });
};

export const successModal = (modalTitle, modalContent) => {
    Modal.success({
        title: modalTitle,
        icon: <CheckCircleFilledSVG twoToneColor={"#52c41a"} style={{ fontSize: '18px' }} />,
        content: modalContent,
    });
};

export const errorModal = (modalTitle, modalContent) => {
    Modal.error({
        title: modalTitle,
        icon: <CloseCircleFilledSVG twoToneColor={'#ff4d4f'} style={{ fontSize: '18px' }} />,
        content: modalContent,
    });
};

export const warningModal = (modalTitle, modalContent) => {
    Modal.warning({
        title: modalTitle,
        icon: <WarningFilledSVG twoToneColor={'#faad14'} style={{ fontSize: '18px' }} />,
        content: modalContent,
    });
};

export const successMessage = (messageApi, content) => {
    messageApi.open({
        type: 'success',
        content: content,
        duration: 3,
    });
};
export const errorMessage = (messageApi, content) => {
    messageApi.open({
        type: 'error',
        content: content,
        duration: 3,
    });
};
export const warningMessage = (messageApi, content) => {
    messageApi.open({
        type: 'warning',
        content: content,
        duration:3,
    });
}