import express from "express"
import path from 'path'
import http from "http"
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import morgan from 'morgan'
import cors from 'cors'
import authRoute from './routes/auth.routes.js'
import chatRoute from './routes/chat.routes.js'
import feedRoute from './routes/feed.routes.js'
import followRoute from './routes/follow.routes.js'
import messagesRoute from './routes/messages.routes.js'
import mercadopagoRoute from './routes/mercadopago.routes.js'
import paymentsRoute from './routes/payments.routes.js'
import profileRoute from './routes/profile.routes.js'
import searchRoute from './routes/search.routes.js'
import walletsRoute from './routes/wallets.routes.js'
import moderationRoute from './routes/moderation.routes.js'
import notificationsRoute from "./routes/notifications.routes.js"
import adminRoute from './routes/admin.routes.js'

import { Server as SocketServer } from "socket.io"
import User from "./models/User.js";
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

var corsOptions = {
    origin: ['https://www.groob.com.ar', 'https://groob.com.ar', 'https://groob.vercel.app', 'https://groob.online', 'https://www.groob.online', 'https://groob.store', 'https://www.groob.store', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
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


// Settings
app.use(errorHandler);
app.set('port', process.env.PORT || 8080)

// Middlewares
app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors(corsOptions));
app.set("trust proxy", 1);
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true, limit: "150mb" }));
app.use(express.json({ limit: "150mb" }));

// Routes
app.use(authRoute)
app.use(profileRoute)
app.use(feedRoute)
app.use(searchRoute)
app.use(followRoute)
app.use(chatRoute)
app.use(messagesRoute)
app.use(walletsRoute)
app.use(mercadopagoRoute)
app.use(paymentsRoute)
app.use(moderationRoute)
app.use(notificationsRoute)
app.use(adminRoute)

// Static files
app.use('/uploads', express.static(path.resolve('uploads')));
// const {pathname: root} = new URL('public', import.meta.url)
// app.use(express.static(path.join(__dirname, 'public')))

let activeUsers = []

let connected = ""

const addNewUser = (userId, socketId) => {
    !activeUsers.some(obj => obj.userId === userId) && activeUsers.push({ userId, socketId })
}

const removeUser = (socketId) => {
    activeUsers = activeUsers.filter(obj => obj.socketId !== socketId)
}

const getUser = (userId) => {
    return activeUsers.find(obj => obj.id === userId)
}
io.on("connection", (socket) => {

    socket.on("newUserAdded", (newUserId) => {
        addNewUser(newUserId, socket.id)
        io.emit("getUsers", activeUsers) // send the users active
    })

    socket.on("newMessage", (data) => {
        if (data) {
            const user = activeUsers.find((user) => user.userId === data.receiverId)
            if (user) {
                io.emit("reciveMessage", data.newSocketMessage);
            }
        }
    })

    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
        io.emit("getUsers", activeUsers)
    })
})


export default server;