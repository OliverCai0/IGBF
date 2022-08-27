import { fork } from "redux-saga/effects";
import handlePhotos from "./handlers/photos";
import handleUser from "./handlers/user";

export function* watcherSaga() {
  yield fork(handleUser);
  yield fork(handlePhotos);
}
