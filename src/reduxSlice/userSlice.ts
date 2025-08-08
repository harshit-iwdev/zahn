import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  profileData: any,
  isAuthenticated: boolean,
  isLoading: boolean,
  loginUserData: any
}

const initialState: UserState = {
  profileData: {},
  isAuthenticated: false,
  isLoading: false,
  loginUserData: {}
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfileData(state, action: PayloadAction<any[]>) {
      state.profileData = action.payload
    },
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setLoginUserData(state, action: PayloadAction<any>) {
      state.loginUserData = action.payload
    }
  },
})

export const { setUserProfileData, setIsAuthenticated, setIsLoading, setLoginUserData } = userSlice.actions
export default userSlice.reducer