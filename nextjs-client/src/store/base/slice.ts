import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';

export interface LlmModels{
    id: string | number;
    modelValue: string;
    ModelName: string
    dateTimeCreated: string | Date;
    isActive: boolean
}

export type CollapsedDataContainerType = 'llm-selector' | 'items-list-selector' | 'pin-items-list-selector' | '' ;
export interface BaseState {
    isUserPromptFieldInActiveState: boolean;
    isSidebarCollapsed: boolean;
    isVoiceRecordingActive: boolean; // Optional field for voice recording state,
    isConversationTitleEditingActive: {isEditing:boolean, conversationId: string, conversationTitle: string}; // Optional field for conversation title editing state
    showCollapsedData: CollapsedDataContainerType; // Restrict to CollapsedDataContainerType
    uploadedFilesTempLocation: UploadFile[] & RcFile[]; // Optional field for uploaded files
    uploadedFilesDisplayList? : collapseItemsInterface[] | [],
    llmModels: LlmModels[] | []
}

export interface collapseItemsInterface {
    key: string;
    label: React.ReactNode;
    style?: React.CSSProperties | undefined;
    className?: string;
    children?: React.ReactNode;
}
const initialState: BaseState = {
    isUserPromptFieldInActiveState: false,
    isSidebarCollapsed: false,
    isVoiceRecordingActive: false,
    isConversationTitleEditingActive: {isEditing: false, conversationId: '', conversationTitle: ''}, // Default state for conversation title editing
    showCollapsedData: '', // Default value
    uploadedFilesTempLocation: [],
    uploadedFilesDisplayList: [],
    llmModels : []
};

export const baseSlicer = createSlice({
    name: 'base',
    initialState,
    reducers: {
        setUserPromptFieldActiveState: (state, action: PayloadAction<boolean>) => {
            state.isUserPromptFieldInActiveState = action.payload;
        },
        setSidebarCollapsedState: (state, action: PayloadAction<boolean>) => {
            state.isSidebarCollapsed = action.payload;
        },
        setVoiceRecordingActiveState: (state, action: PayloadAction<boolean>) => {
            state.isVoiceRecordingActive = action.payload;
        },
        setConversationTitleEditingActiveState: (state, action: PayloadAction<{isEditing:boolean, conversationId: string, conversationTitle: string}>) => {
            state.isConversationTitleEditingActive = action.payload;
        },
        setShowCollapsedData: (state, action: PayloadAction<CollapsedDataContainerType>) => {
            state.showCollapsedData = action.payload;
        },
        setUploadedFilesTempLocation: (state, action: PayloadAction<UploadFile[] & RcFile[]>) => {
            state.uploadedFilesTempLocation = action.payload;
        },
        setUploadedFilesDisplayList: (state, action: PayloadAction<collapseItemsInterface[] | []>) => {
            state.uploadedFilesDisplayList = action.payload;
        },
        setLlmModelsList: (state, action: PayloadAction<LlmModels[] | []>) => {
            state.llmModels = action.payload;
        }
        
    },
});

export const {
    setUserPromptFieldActiveState,
    setSidebarCollapsedState,
    setVoiceRecordingActiveState,
    setConversationTitleEditingActiveState,
    setShowCollapsedData,
    setUploadedFilesTempLocation,
    setUploadedFilesDisplayList,
    setLlmModelsList
} = baseSlicer.actions;

export default baseSlicer.reducer;
