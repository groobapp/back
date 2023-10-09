import dotenv from 'dotenv'
dotenv.config()
import app from "./src/app.js"
import './src/database.js'

app.listen(process.env.PORT, () => {
    console.log(`app en puerto ${process.env.PORT}`)
})
