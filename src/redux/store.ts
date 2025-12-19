import { configureStore } from "@reduxjs/toolkit"
import createSagaMiddleware from "redux-saga"
import weddingReducer from "./slices/weddingSlice"
import authReducer from "./slices/authSlice"
import  photoReducer from "./slices/photoSlice"
import rootSaga from "./sagas/rootSaga"

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    weddings: weddingReducer,
    auth: authReducer,
    photos: photoReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
