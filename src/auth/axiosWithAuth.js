import axios from 'axios';

export default() => {
    const auth = 'Token ac6e9fac44b48a6974eb8add0a3715184057be52'

    return axios.create({
        headers: {
            'Authorization': auth,
            'Content-Type': 'application/json',
        }
    })
}