import React, { useEffect, useState } from 'react'
import './style.css'
import { get, ref, remove, set } from 'firebase/database'
import { database } from '../../Firebase/Firebase'
import { auth } from '../../Firebase/Firebase'
import { onAuthStateChanged } from 'firebase/auth'

const Users = () => {

    const [users, setUser] = useState([])
    const [admin, setAdmin] = useState(false)
    const [data, setData] = useState(false)

    const getAllUser = async () => {
        let user = await get(ref(database));
        if(user.val() === null){
            setData(false)
        }else{
            user = Object.entries(user.val()).map(([id, val]) => ({
                id: id,
                ...val
            }))
            setUser(user)
            setData(true)
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (!user) {
                setAdmin(false)
                return
            } else {
                getAllUser()
                setAdmin(true)

            }
        })
    }, [])

    const deleteUser = async (id) => {
        await remove(ref(database, id));
        setUser(users.filter(val => val.id !== id))
    }

    return (
        <div className='userMain'>
            {admin ? <div className='users'>
                {data ? <table>
                        <thead>
                            <tr>
                                <th>FullName</th>
                                <th>Phone Number</th>
                                <th>Address</th>
                                <th>Grade</th>
                                <th>Course</th>
                                <th>control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users?.map((val, idx) => {
                                    return <tr key={idx}>
                                        <td>{val.Name}</td>
                                        <td>{val.id}</td>
                                        <td>{val.Address}</td>
                                        <td>{val.Grade}</td>
                                        <td>{val.Course}</td>
                                        <td><button onClick={() => deleteUser(val.id)}>delete</button></td>
                                    </tr>
                                })
                            }

                        </tbody>
                    </table> : <h1 style={{color:'white', textAlign : 'center'}}>Currently no User Apply..</h1>
                }
            </div> : <h1 style={{
                color: 'white',
                fontSize: '5vw'
            }}
            >404</h1>}
            
        </div>
    )
}

export default Users