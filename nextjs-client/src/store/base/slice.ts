import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BaseState {
    isUserPromptFieldInActiveState: boolean;
    isSidebarCollapsed: boolean;
    isVoiceRecordingActive?: boolean; // Optional field for voice recording state
}

const initialState: BaseState = {
    isUserPromptFieldInActiveState: false,
    isSidebarCollapsed: false,
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
        }
    },
});

export const {
    setUserPromptFieldActiveState,
    setSidebarCollapsedState,
    setVoiceRecordingActiveState
} = baseSlicer.actions;

export default baseSlicer.reducer;
