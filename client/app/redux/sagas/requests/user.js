const axios = require('axios')

export function addNewUser(action){
    const email = action.payload.email
    const password = action.payload.password
    console.log('Request ', action)
    return axios.post(
        'http://localhost:6000/users/signup', {
            email,
            password
        }
    )
}