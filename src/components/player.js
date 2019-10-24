import React, {useState, useEffect} from 'react';
import axiosWithAuth from '../auth/axiosWithAuth';

function Player(){
    const [players, setPlayer] = useState([])

    useEffect(() => {
        const playerData = () => {
            axiosWithAuth()
            .post('https://lambda-treasure-hunt.herokuapp.com/api/adv/status/')
            .then(res => {
                console.log(res.data)
                setPlayer(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        }
        playerData()
    },[])

    return(
        <>
        <h1>{players.name}</h1>
        <p>Cooldown: {players.cooldown}</p>
        <p>Encumbrance: {players.encumbrance}</p>
        <p>Inventory: {players.inventory}</p>
        <p>Bodywear: {players.bodywear}</p>
        <p>Footwear: {players.footwear}</p>
        <p>Gold: {players.gold}</p>
        <p>Strength: {players.strength}</p>
        <p>Speed: {players.speed}</p>
        </>
    )
}

export default Player;