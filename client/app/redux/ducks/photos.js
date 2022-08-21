import { createSlice } from "@reduxjs/toolkit";

const photoSlice = createSlice({
    name: 'photos',
    initialState: [],
    reducers: {
        addPhoto(state, action) {
            const newPhoto = action.payload
            return [...state, newPhoto]
        }
    }
})

export const {addPhoto} = photoSlice.actions
export default photoSlice.reducer