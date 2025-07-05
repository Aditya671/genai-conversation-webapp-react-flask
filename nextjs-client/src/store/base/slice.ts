import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadFile } from 'antd';

export type CollapsedDataContainerType = 'llm-selector' | 'items-list-selector' | 'pin-items-list-selector' | '' ;
export interface BaseState {
    isUserPromptFieldInActiveState: boolean;
    isSidebarCollapsed: boolean;
    isVoiceRecordingActive: boolean; // Optional field for voice recording state,
    isConversationTitleEditingActive: {isEditing:boolean, conversationId: string}; // Optional field for conversation title editing state
    showCollapsedData: CollapsedDataContainerType; // Restrict to CollapsedDataContainerType
    uploadedFilesTempLocation?: UploadFile[] | []; // Optional field for uploaded files
    uploadedFilesDisplayList? : collapseItemsInterface[] | []
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
    isConversationTitleEditingActive: {isEditing: false, conversationId: ''}, // Default state for conversation title editing
    showCollapsedData: '', // Default value
    uploadedFilesTempLocation: [],
    uploadedFilesDisplayList: []
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
        setConversationTitleEditingActiveState: (state, action: PayloadAction<{isEditing:boolean, conversationId: string}>) => {
            state.isConversationTitleEditingActive = action.payload;
        },
        setShowCollapsedData: (state, action: PayloadAction<CollapsedDataContainerType>) => {
            state.showCollapsedData = action.payload;
        },
        setUploadedFilesTempLocation: (state, action: PayloadAction<UploadFile[] | []>) => {
            state.uploadedFilesTempLocation = action.payload;
        },
        setUploadedFilesDisplayList: (state, action: PayloadAction<collapseItemsInterface[] | []>) => {
            state.uploadedFilesDisplayList = action.payload;
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
    setUploadedFilesDisplayList
} = baseSlicer.actions;

export default baseSlicer.reducer;
