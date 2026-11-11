import { configureStore } from '@reduxjs/toolkit'
import lectureReducer from '../features/lectures/lectureSlice'

export const store = configureStore({
  reducer: {
    lectures: lectureReducer
  }
})