
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'


export const fetchLectures = createAsyncThunk(
  'lectures/fetchLectures',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/lectures')
      return Array.isArray(response.data)
        ? response.data
        : response.data.lectures || []
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch lectures'
      )
    }
  }
)

export const createLecture = createAsyncThunk(
  'lectures/createLecture',
  async (lectureData, { rejectWithValue }) => {
    try {
      const response = await api.post('/lectures', lectureData)
      return response.data.lecture || response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to save lecture'
      )
    }
  }
)

const lectureSlice = createSlice({
  name: 'lectures',

  initialState: {
    lectures: [],
    loading: false,
    creating: false,
    error: null
  },

  reducers: {
  addLocalLecture: (state, action) => {
    state.lectures.unshift(action.payload)
  },

  removeLecture: (state, action) => {
    state.lectures = state.lectures.filter(
      lecture => (lecture._id || lecture.id) !== action.payload
    )
  }
},

  extraReducers: builder => {
    builder
      .addCase(fetchLectures.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLectures.fulfilled, (state, action) => {
        state.loading = false
        state.lectures = action.payload
      })
      .addCase(fetchLectures.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(createLecture.pending, state => {
        state.creating = true
        state.error = null
      })
      .addCase(createLecture.fulfilled, (state, action) => {
        state.creating = false
        state.lectures.unshift(action.payload)
      })
      .addCase(createLecture.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload
      })
  }
})

export const { addLocalLecture, removeLecture } = lectureSlice.actions
export default lectureSlice.reducer
