import {fork} from 'redux-saga/effects'
import handleUser from './handlers/user'

export function* watcherSaga() {
    yield fork(handleUser)
}