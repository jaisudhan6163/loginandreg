const redis = require('redis')
const dotenv = require('dotenv')

dotenv.config()

const redisClient = () => {
    return redis.createClient()
}

const client = redisClient()

client.on("error", (e) => {
    console.log(e)
})

client.on("connect", (e) => {
    console.log("connected to redis")
})

client.on("end", (e) => {
    console.log("redis connection ended")
})

client.on("SIGQUIT", (e) => {
    client.quit
})

module.exports = client