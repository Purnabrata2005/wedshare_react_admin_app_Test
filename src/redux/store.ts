import { configureStore } from "@reduxjs/toolkit"
import createSagaMiddleware from "redux-saga"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { combineReducers } from "@reduxjs/toolkit"
import weddingReducer from "./slices/weddingSlice"
import authReducer from "./slices/authSlice"
import photoReducer from "./slices/photoSlice"
import inviteReducer from "./slices/inviteSlice"
import rootSaga from "./sagas/rootSaga"

const sagaMiddleware = createSagaMiddleware()

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "weddings", "photos", "invite"], // Specify which reducers to persist
}

// Combine all reducers
const rootReducer = combineReducers({
  weddings: weddingReducer,
  auth: authReducer,
  photos: photoReducer,
  invite: inviteReducer,
})

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(sagaMiddleware),
})

export const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
