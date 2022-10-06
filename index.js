import dotenv from 'dotenv'
dotenv.config()
import server from "./src/app.js"
import './src/database.js'

server.listen(8080, () => {
    console.log(`app on port 8080`) 
})
