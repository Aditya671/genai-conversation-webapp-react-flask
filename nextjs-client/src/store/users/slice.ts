import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UsersState {
    userId: string | '';
}

const initialState: UsersState = {
    userId: '68696b3e9708aaa3e94aa3ee',
};

export const usersSlicer = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUserId: (state, action: PayloadAction<string>) => {
            state.userId = action.payload;
        },
    },
});

export const { setUserId } = usersSlicer.actions;

export default usersSlicer.reducer;
