import { all, call, put, takeEvery, takeLatest } from "redux-saga/effects"
import { addPhoto, addPhotoToState, clearPhotos, removePhoto, removePhotosFromState, savePhotos } from "../../ducks/photos"

function* handleTakePhoto(action) {
    try{
        yield put(addPhotoToState(action.payload))
    }catch(error){
        console.log("Photo taking error:", error)
    }
}

function* handleDeletePhoto(action){
    try{
        console.log('handleDelete', action.payload)
        yield put(removePhotosFromState(action.payload))
    }catch(error){
        error.log("Photo deleting error", error)
    }
}

function* handleSavePhoto(action){
    try{
        yield put(removePhotosFromState(action.payload))
    }catch(error){
        console.log("Photo saving error:", error)
    }
}

export default function* handlePhotos(){
    yield all([
        takeEvery(addPhoto.type, handleTakePhoto),
        takeLatest(removePhoto.type, handleDeletePhoto),
        takeLatest(savePhotos.type, handleSavePhoto)
    ])
}