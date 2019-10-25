import axios from 'axios';

export default() => {
    const auth = 'Token REPLACEME'

    return axios.create({
        headers: {
            'Authorization': auth,
            'Content-Type': 'application/json',
        }
    })
}