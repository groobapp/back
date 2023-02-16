import dotenv from 'dotenv'
dotenv.config()
import server from "./src/app.js"
import './src/database.js'

server.listen(process.env.PORT, () => {
    console.log(`app on port ${process.env.PORT}`) 
})
