// import React, { useState, useEffect } from 'react';
// import axiosWithAuth from '../auth/axiosWithAuth';

// const Map = ({ playerData }) => {
//     const [rooms, setRooms] = useState([])


//     useEffect(() => {
//         const getRooms = () => {
//             axiosWithAuth()
//             .get('https://t7-api.herokuapp.com/rooms/')
//             .then(res => {
//                 console.log(res.data)
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//         }
//         getRooms()
//     }, [])

//     return(
//         <>
//         <h1>Map</h1>
        
//         </>
//     )

// }

// export default Map;

import React, {useState, useEffect} from 'react';
import axios from '../auth/axiosWithAuth';



// async followPath(path, get=false) {
//     if (Date.now() < this.cdDone)  {
//         console.log('COOLDOWN NOT FINISHED');
//         console.log(Date.now());
//         console.log(this.cdDone);
//         return
//     };

//     console.log("IMPROVED PATH:", path);
//     let stop = false;
//     for (let i = 0; i < path.length; i++) {
//         if (stop) break;
//         console.log(this.loc);
//         let next = path[i];
//         if (Array.isArray(next)) {
//             console.log(`DASHING ${next[0].dir} ${next.length} rooms to ${next[next.length - 1].id}...`);
//             await this.dash(next);
//             console.log("CD", this.cd)
//             await wait(this.cd * 1000);
//         } else if (next.terrain === "CAVE" || next.terrain === "TRAP") {
//             console.log(`MOVING ${next.dir} to ${next.id}...`);
//             await this.move(next.dir);
//             console.log("CD", this.cd)
//             await wait(this.cd * 1000);
//         } else {
//             console.log(`FLYING ${next.dir} to ${next.id}...`);
//             await this.fly(next.dir);
//             console.log("CD", this.cd)
//             await wait(this.cd * 1000);
//         }
//         if (get && this.loc.items.length) {
//             await this.getAll();
//             await this.status()
//             await wait(this.cd * 1000)
//             if (this.stats.enc >= this.stats.str) {
//                 stop = true; 
//                 while (this.stats.enc >= this.stats.str) {
//                     await this.generic(this.stats.inv[0], "drop")
//                     await wait(this.cd * 1000)
//                     await this.status()
//                     await wait(this.cd * 1000)
//                 }
//             }
//         }
//     }
//     if (!stop) console.log("Finished the Path!")
//     else console.log("Stopped early!")
//     return {loc: this.loc, stopped: stop};
// }

const Map = ({ playerData }) => {
  const [rooms, setRooms] = useState([])
  const [grid, setGrid] = useState({
    "width": 26,
    "height": 30,
    "num_rooms": 500
  })
  const [matrix, setMatrix] = useState([])
//   const [current, setCurrent] = useState([])

    

  useEffect(() => {
    const getRooms = async () => {
      try {
        if (localStorage.getItem('rooms')) {
            let rooms = JSON.parse(localStorage.getItem('rooms'))
            // let currentRoom = rooms.filter(room => room.here)
            // setCurrent(() => {
            //     return currentRoom[0].coordinates
            // })
          setRooms(() => rooms);
          // setGrid(JSON.parse(localStorage.getItem('rooms')).grid);
        } else {
        //   let { data } = await axios().get('https://team-o.herokuapp.com/api/adv/rooms');
          let { data } = await axios().post('https://t7-api.herokuapp.com/map');
          if (data) {
            localStorage.setItem('rooms', JSON.stringify(data.rooms));
            console.log(data.rooms)
            setRooms(data.rooms);
            // setGrid()
          }
        }
      } catch (error) {
        console.log('err', error)
      }
    }

    getRooms()
  }, []);

  // Create our map when rooms is updated
  useEffect(() => {
    console.log('playerData:', playerData)
    console.log('rooms:', rooms)
    if(rooms.length === 0) {
      return
    }

    const room_matrix = []

    for (let i = 0; i < grid.height + 1; i++) {
      room_matrix.push(new Array(grid.width).fill(0))
    }

    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      room.n_to = (room.exits >> 3) & 1
      room.e_to = (room.exits >> 2) & 1
      room.s_to = (room.exits >> 1) & 1
      room.w_to = room.exits & 1
      
      room_matrix[rooms[i].coordinates.y - 45][rooms[i].coordinates.x - 49] = room
    }

    // reverse our matrix so it prints correctly
    room_matrix.reverse()

    const handleOnClick = async (e) => {
        try {

            const coords = e.target.dataset['coords']
            let { data: { path } } = await axios().post('https://t7-api.herokuapp.com/getPath', { destination: coords });
            const wait = ms => {
                console.log(`sleeping for ${(ms + 2000) / 1000}`)
                return new Promise((res, rej) => setTimeout(res, ms + 2000))
            }

            const status = async () => {
                return axios().post('https://t7-api.herokuapp.com/init')
            }

            const dash = async (direction, number, position) => {
                const endpoint = 'https://t7-api.herokuapp.com/roomids/'
                console.log('position :', position);
                console.log('number :', number);
                
                const coords = []
                
                for (let i = 0; i < number; i++) {
                    if (direction == "n") {
                        position['y'] += 1
                    }
                    if (direction == "e") {
                        position['x'] += 1
                    }
                    if (direction == "s") {
                        position['y'] -= 1
                    }
                    if (direction == "w") {
                        position['x'] -= 1
                    }
                    
                    coords.push(`(${position['x']},${position['y']})`);
                }
                
                console.log('coords', coords);
                // throw 'error';

                let { data: { ids }} = await axios().post(endpoint, { coords })
                // console.log(response.data.ids)
                // throw('error')
                return axios().post('https://t7-api.herokuapp.com/dash', {
                    direction,
                    num_rooms: `${number}`,
                    next_room_ids: ids.join(','),
                });
            }

            const traverse = direction => {
                return axios().post('https://t7-api.herokuapp.com/move', { direction: direction })
            }
            // let moves = path.map(direction => {
            //     return axios().post('https://t7-api.herokuapp.com/move', { direction: direction }).then(() => console.log('hi?'));
            // });
            // await Promise.all(moves)
            const travel = async (path, get=false) => {
                // some global date/cd stuff
                let { data: { data: { coordinates, cooldown } } } = await status()
                await wait(cooldown * 1000)
                let current = coordinates
                
                let stop = false;
                for (let i = 0; i < path.length; i++) {
                    let shouldDash = 0
                    console.log('current :', current);
                    if (stop) break;
                    let next = path[i];
                    console.log('next :', next);
                    // if (i + 1 >= path.length) break;
                    if (next === path[i + 1]) {
                        while (path[i] === path[i + 1]) {
                            // if (i + 1 >= path.length) break;
                            i++;
                            shouldDash++;
                        }
                    }
                    let data;
                    if (shouldDash > 0) {
                        console.log('CURRENT 2 :', current);
                        let response = await dash(next, shouldDash + 1, current);
                        console.log('response 2 :', response);
                        data = response.data.data;
                        current = data.coordinates;
                    } else {
                        let response = await traverse(next);
                        console.log('response 1 :', response);
                        data = response.data.data;
                        current = data.coordinates;
                        console.log('CURRENT 1 :', current);
                    }
                    // console.log('out data', data);

                    setRooms((oldRooms) => {
                        let rooms = oldRooms.map(room => ({
                            ...room,
                            here: room.id === data.room_id,
                        }));
                        return rooms
                    })
                    console.log('sleeping')
                    await wait(data.cooldown * 1000)
                }
            };

            // const travel = (path, get=false) => {
            //     // some date/cd stuff
        
            //     let stop = false;
            //     for (let i = 0; i < path.length; i++) {
            //         if (stop) break;
            //         let next = path[i];
            //         await this.traverse(next);
            //         console.log('CD:', this.cd);
            //         await wait(this.cd * 1000)
            //     }
            // };

            await travel(path)

            // let i = 0
            // console.log(path)
            // while (i < path.length) {
            //     console.log(i)
            //     i++;
            // }

            // // path.forEach(async (direction) => {
            // //     try {
            // //         let { data } = await axios().post('https://t7-api.herokuapp.com/move', { direction: direction })
            // //         console.log(data)
            // //     } catch (error) {
            // //         console.log(error.data.response);
            // //     }
            // // })
            // console.log('ut oh we in trouble')
        } catch (error) {
            console.log(error);
        }
    }
    
    let rows = [];
    room_matrix.forEach((row) => {
      let cols = row.map(room => {
        // console.log(room.exists >> 3 & 1)
        if (room.id === 469) {
          console.log('room :', room);
        }
        if (room === 0) {
          return (<span style={{
              backgroundColor: "transparent",
              width: "40px",
              height: "40px",
              display: "inline-block",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 -1px",
              position: "relative",
              border: "none"
          }}></span>)
        }
        let descriptions = [
            'A Dark Cave',
            'A misty room',
            'Mt. Holloway'
        ]
        let background = `rgb(${(245 - (room.elevation * 35))},${(245 - (room.elevation * 35))},${(245 - (room.elevation * 35))})`;
        if (room.here) {
            background = '#2bbb2b'
        } else if (room.terrain === "CAVE") {
            background = "#37358e"
        } else if (descriptions.indexOf(room.title) < 0) {
            background = "#dbef72"
        }
        return (<span onClick={handleOnClick} data-coords={`(${room.coordinates.x},${room.coordinates.y})`} style={{
          // border: "1px solid red",
          // backgroundColor: room.here ? "rgba(255, 255, 255, 1)" : (room.safe ? "rgba(46, 193, 46, 0.6)" : "rgba(0, 0, 0, 0.6)"),
          backgroundColor: background, //room.here ? "green" : `rgb(${(255 - (room.elevation * 35))},${(255 - (room.elevation * 35))},${(255 - (room.elevation * 35))})`,
          // color: room.here ? "black" : "white",
          cursor: 'pointer',
          color: "black",
          width: "40px",
          height: "40px",
          display: "inline-block",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 -1px",
          position: "relative",
          border: room.safe ? "2px solid rgb(46, 193, 46)" : "0",
          border: "2px solid #2d2d2d",
          borderTop: room.n_to > 0 ? "none" : "2px solid #2d2d2d",
          borderRight: room.e_to > 0 ? "none" : "2px solid #2d2d2d",
          borderBottom: room.s_to > 0 ? "none" : "2px solid #2d2d2d",
          borderLeft: room.w_to > 0 ? "none" : "2px solid #2d2d2d",
        }} key={room.id}>
          {room.id}
        </span>)
      });

      // if (room > 0) {
      rows.push(<div className="row" style={{ display: "flex", margin: "-1px 0" }}>{cols}</div>)
      // }
    });

    setMatrix(rows)

  }, [rooms]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: '20px' }} className="matrix">
      {
        matrix
      }
    </div>
  )
}

export default Map;
