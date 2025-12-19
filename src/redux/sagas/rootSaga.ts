// src/redux/sagas/rootSaga.ts
import { all, fork } from "redux-saga/effects"
import weddingSaga from "./weddingSaga"
import authSaga from "./authSaga"
import { photoSaga } from "./photoSaga"

export default function* rootSaga() {
  yield all([
    fork(weddingSaga),
    fork(authSaga),
    fork(photoSaga),   // <-- NOW IT RUNS!!
  ])
}
