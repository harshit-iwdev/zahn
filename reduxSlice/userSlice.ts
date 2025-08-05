import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  profileData: any
}

const initialState: UserState = {
  profileData: {},
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfileData(state, action: PayloadAction<any[]>) {
      state.profileData = action.payload
    },
  },
})

export const { setUserProfileData } = userSlice.actions
export default userSlice.reducer