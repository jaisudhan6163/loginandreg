import React, { useEffect, useState } from 'react'
import {Container, Button} from 'react-bootstrap'
import '../styles/Home.css'
import axios from 'axios'
import API_URL from '../../config/global'

const Home = () => {

    const [res, setRes] = useState({})

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'))
        if(user && user.token){
            getData(user.token)
        }
    },[])

    const getData = async (token) => {
        try {
            const config = {
                headers: {
                    Authorization: token
                }
            }

        const response = await axios.get(`${API_URL}/home`, config)
        console.log(response)

        if(response.data === "Invalid Token"){
            alert("Login again")
        }else if(response.data === "Server Busy"){
            alert("Unauthorized access")
        }else if(response?.status){
            setRes(response.data)
            console.log(res)
        }

        } catch (e) {
            console.log(e)
        }
    }

    return(
        <Container>
            <h1>Welcome to our website</h1>
            <p>We are here to serve you</p>
            <Button varient='primary' type='submit'>
                Get Started {res.name}
            </Button>
        </Container>
    )
}

export default Home