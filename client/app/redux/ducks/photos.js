import { createSlice } from "@reduxjs/toolkit";

const photoSlice = createSlice({
  name: "photos",
  initialState: [],
  reducers: {
    addPhoto() {},
    addPhotoToState(state, action) {
      const newPhoto = action.payload;
      console.log("Photo reducer:", newPhoto);
      return [...state, newPhoto];
    },
    removePhoto() {},
    removePhotosFromState(state, action) {
      const targets = action.payload;
      console.log("Photo delete reducer:", targets);
      return state.filter((element, index) => !targets.includes(index));
    },
    savePhotos() {},
    clearPhotos(state, action) {
      return [];
    },
  },
});

export const {
  addPhoto,
  removePhoto,
  savePhotos,
  clearPhotos,
  addPhotoToState,
  removePhotosFromState,
} = photoSlice.actions;
export default photoSlice.reducer;
