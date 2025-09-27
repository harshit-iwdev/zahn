import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
  isConnected: boolean;
  connectionError: string | null;
  lastMessage: any;
}

const initialState: SocketState = {
  isConnected: false,
  connectionError: null,
  lastMessage: null,
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setConnectionError: (state, action: PayloadAction<string | null>) => {
      state.connectionError = action.payload;
    },
    setLastMessage: (state, action: PayloadAction<any>) => {
      state.lastMessage = action.payload;
    },
  },
});

export const { setConnected, setConnectionError, setLastMessage } = socketSlice.actions;
export default socketSlice.reducer; 