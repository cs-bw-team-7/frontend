import React, { useState, useEffect } from 'react';
import axiosWithAuth from '../auth/axiosWithAuth';

const Map = ({ playerData }) => {
    const [rooms, setRooms] = useState([])


    useEffect(() => {
        const getRooms = () => {
            axiosWithAuth()
            .get('https://t7-api.herokuapp.com/rooms/')
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        }
        getRooms()
    }, [])

    return(
        <>
        <h1>Map</h1>
        
        </>
    )

}

export default Map;
