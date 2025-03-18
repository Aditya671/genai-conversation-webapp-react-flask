import { configureStore } from '@reduxjs/toolkit'
import conversationSlicer from './conversations/slice'
import messageSlicer from './messages/slice'
import usersSlicer from './users/slice'
import baseSlicer from './base/slice'

export const store = configureStore({
    reducer: {
        conversations: conversationSlicer,
        messages: messageSlicer,
        users: usersSlicer,
        base: baseSlicer
    }
})