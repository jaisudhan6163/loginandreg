const User = require('../models/User')
const {sendMail} = require('./SendMail')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const VerifyUser = require('../models/VerifyUser')
const API_URL = require('../config/global')

dotenv.config()

async function InsertVerifyUser(name, email, password){
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const token = generateToken(email)

        const newUser = new VerifyUser({
            name:name,
            email:email,
            password:hashedPassword,
            token:token
        })

        const activationLink = `${API_URL}/signin/${token}`
        const content =  `<h4>Hi, there</h4>
        <h5>Welcome to the app</h5>
        <p>Thank you for signing up. Click on the below link to activate</p>
        <a href = '${activationLink}'>Click here</a>
        <p>Regards</p>
        <p>Team</p>`

        await newUser.save()
        sendMail(email, "Verify User", content)
    }
    catch(e){
        console.log(e)
    }
}

async function InsertSignUpUser(token){
    try{   
        const userVerify = await VerifyUser.findOne({ token: token })
        if(userVerify){
            const newUser = new User({
                name: userVerify.name,
                email: userVerify.email,
                password: userVerify.password,
                forgotPassword: {}
            })
            await newUser.save()
            await userVerify.deleteOne({ token: token })
            const content = `<h4>Registration successfull</h4>
            <h5>Welcome to the app</h5>
            <p>Successfully Registered</p>
            <p>Regards</p>
            <p>Team</p>`
            sendMail(newUser.email, "Verified Successfull", content)
            return `<h4>Registration successfull</h4>
            <h5>Welcome to the app</h5>
            <p>Successfully Registered</p>
            <p>Regards</p>
            <p>Team</p>`
        }
        return `<html>
        <body>
        <h4>Registration failed</h4>
        <p>Link Expired...</p>
        <p>Regards</p>
        <p>Team</p>
        </body>
        </html>`
    }
    catch(e){
        console.log(e)
    }
}

function generateToken(email){
    const token = jwt.sign(email, process.env.secret_token)
    return token
}

module.exports = {InsertVerifyUser, InsertSignUpUser}