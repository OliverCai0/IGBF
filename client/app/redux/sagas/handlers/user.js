import { all, call, put, takeLatest } from "redux-saga/effects";
import { setUser, signupUser } from "../../ducks/user";
import { addNewUser } from "../requests/user";

function* handleSignUp(action) {
  try {
    console.log("Trying", action);
    const response = yield call(addNewUser, action);
    console.log("Response", response.data.result.token);
    console.log("Keys", Object.keys(response.data));
    const data = {
      email: response.data.result.email,
      token: response.data.result.token,
      uuid: response.data.result._id,
    };
    yield put(setUser(data));
  } catch (error) {
    console.log(error);
  }
}

export default function* handleUser() {
  yield all([takeLatest(signupUser.type, handleSignUp)]);
}
