import express from "express"
import path from 'path'
import http from "http"
import url from 'url';
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import morgan from 'morgan'
import cors from 'cors'
import authRoute from './routes/auth.routes.js'
import chatRoute from './routes/chat.routes.js'
import feedRoute from './routes/feed.routes.js'
import followRoute from './routes/follow.routes.js'
import messagesRoute from './routes/messages.routes.js'
import paymentsRoute from './routes/payments.routes.js'
import profileRoute from './routes/profile.routes.js'
import searchRoute from './routes/search.routes.js'
import walletsRoute from './routes/wallets.routes.js'

import { Server as SocketServer } from "socket.io"
dotenv.config() 

// Inicialization
const app = express()
const server = http.createServer(app)

// export instance for new sockets in endpoints

let io = new SocketServer(server, {
    cors: {
        origin: ['https://groob.com.ar', 'https://groob.vercel.app', 'https://groob.online', 'https://groob.store',
            'https://www.groob.store', 'https://www.groob.online', 'https://www.groob.com.ar', 'http://localhost:3000'],
        optionsSuccessStatus: 200,
        // credentials: true,
        // methods: ['GET','POST','DELETE','PUT','PATCH', 'OPTIONS'],
        // allowedHeaders: [
        //     'Origin',
        //     'X-Requested-With',
        //     'Content-Type',
        //     'Access-Control-Allow-Origin',
        //     'Access-Control-Allow-Headers',
        //     'Access-Control-Allow-Credentials',
        //     'Accept',
        //     'X-Access-Token',
        //     'authtoken'
        //   ],
    }
})

const errorHandler = (error, req, res, next) => {
    console.log(error)
    res.status(500).json(`Algo ha salido mal: ${error}`)
    next()
};



app.use(errorHandler);
// Settings
app.set('port', process.env.PORT || 8080)
// Middlewares
app.use(cookieParser())
app.use(morgan('dev'))
var corsOptions = {
    origin: ['https://www.groob.com.ar', 'https://groob.com.ar', 'https://groob.vercel.app', 'https://groob.online', 'https://www.groob.online', 'https://groob.store', 'https://www.groob.store', 'http://localhost:3000'],
   credentials: true,
        methods: ['GET','POST','DELETE','PUT','PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Headers',
            'Access-Control-Allow-Credentials',
            'Accept',
            'X-Access-Token',
            'authtoken'
          ],
}
app.use(cors(corsOptions));
app.set("trust proxy", 1);
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true, limit: "85mb" }));
app.use(express.json({ limit: "85mb" }));

// Routes
app.use(authRoute)
app.use(profileRoute)
app.use(feedRoute)
app.use(searchRoute)
app.use(followRoute)
app.use(chatRoute)
app.use(messagesRoute)
app.use(walletsRoute)
app.use(paymentsRoute)

// Static files
app.use('/uploads', express.static(path.resolve('uploads')));
// const {pathname: root} = new URL('public', import.meta.url)
// app.use(express.static(path.join(__dirname, 'public')))


// io.on("connection", (socket) => { // solo para mostrar usuarios online
//     socket.on("newUserAdded", (newUserId) => {
//         if (!activeUsers.some((user) => user.userId === newUserId)) {
//             activeUsers.push(
//                 {
//                     userId: newUserId,
//                     socketId: socket.id
//                 }
//             )
//         }
//         io.emit("getUsers", activeUsers) // send the users active
//     })

//     socket.on("newMessage", (data) => {
//         if (data) {
//             console.log("1- data:", data)
//             const user = activeUsers.find((user) => user.userId === data.reciverId)
//             if (user) {
//                 console.log("2- user: ", user)
//                 // io.to(user.socketId).emit("reciveMessage", data.newSocketMessage);
//                 io.emit("receiveMessage", data.newSocketMessage);
//             }
//         }
//     })

//     socket.on("disconnected", () => {
//         activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
//         console.log("user disconnected", activeUsers)
//         io.emit("getUsers", activeUsers)
//     })
// })


export default server;