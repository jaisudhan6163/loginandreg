const express = require("express")
const app = express()
const port = 4000
const connectDb = require('./db')
const cors = require('cors')
var signinRoute = require('./routes/signin')
var loginRoute = require('./routes/login')
var homeRoute = require('./routes/home')

app.use(express.json())
app.use(cors({origin:"*"}))

connectDb();

app.get("/", (req, res) => {
    res.send("hello world")
})

app.use('/signin', signinRoute)

app.use('/login', loginRoute)

app.use('/home', homeRoute)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})