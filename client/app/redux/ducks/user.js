import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : 'user',
    initialState: {},
    reducers: {
        signupUser() {},
        loginUser() {},
        setUser(state, action) {
            console.log('Inside reducer action', action)
            const userData = action.payload
            return {...state, ...userData}
        }
    }
})

export const {loginUser, signupUser, setUser} = userSlice.actions;
export default userSlice.reducer