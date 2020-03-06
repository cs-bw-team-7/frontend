import axios from 'axios';

export default() => {
    const auth = 'Token ac6e9fac44b48a6974eb8add0a3715184057be52'
    // const auth = 'Token 11fbd1ea6bdcc021756643bbeef39d4d5400821e'

    return axios.create({
        headers: {
            'Authorization': auth,
            'Content-Type': 'application/json',
        }
    })
}