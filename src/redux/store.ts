// lib/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import dashboardReducer from '../reduxSlice/dashboardSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from '../reduxSlice/userSlice'

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  user: userReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['dashboard'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch