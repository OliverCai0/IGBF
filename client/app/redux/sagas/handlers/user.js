import { all, call, put, takeLatest } from "redux-saga/effects";
import { setUser, signupUser } from "../../ducks/user";
import { addNewUser } from "../requests/user";

function* handleSignUp(action) {
    try{
        console.log('Trying', action)
        const response = yield call(addNewUser, action)
        console.log('Response', response)
        // Set User? Not sure how to handle JWT token for now, can use Async Storage if needed
        // Also not sure the formatting is gonna look like on this side so im putting a JSON parse
        yield put(setUser(JSON.parse(response)))
    }catch(error) {
        console.log(error)
    }
}

export default function* handleUser() {
    yield all([
        takeLatest(signupUser.type, handleSignUp)
    ])
}