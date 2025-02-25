import { configureStore } from '@reduxjs/toolkit'
import conversationSlicer from './conversations/slice'
import messageSlicer from './messages/slice'

export const store = configureStore({
    reducer: {
        conversations: conversationSlicer,
        messages: messageSlicer
    }
})