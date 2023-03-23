import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading:false
}

const LoadingReducer = createSlice({
  name: "LoadingReducer",
  initialState,
  reducers: {
    DisplayLoading:(state,action) => {
        state.loading = true
    },
    HideLoading:(state,action) => {
        state.loading = false
    },
  }
});

export const {DisplayLoading,HideLoading} = LoadingReducer.actions

export default LoadingReducer.reducer