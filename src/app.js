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
import profileRoute from './routes/profile.routes.js'
import searchRoute from './routes/search.routes.js'
import walletRoute from './routes/wallet.routes.js'
import moderationRoute from './routes/moderation.routes.js'
import notificationsRoute from "./routes/notifications.routes.js"
import adminRoute from './routes/admin.routes.js'
import { Server as SocketServer } from "socket.io"

dotenv.config()

// Inicialization
const app = express()
const server = http.createServer(app)

// export instance for new sockets in endpoints
const io = new SocketServer(server, {
    cors: {
        origin:  ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000', 'http://localhost:19006', 'http://localhost:19000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
        optionsSuccessStatus: 200,
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
})


var corsOptions = {
    origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000', 'http://localhost:19006', 'http://localhost:19000'],
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
app.use(walletRoute)
app.use(mercadopagoRoute)
app.use(moderationRoute)
app.use(notificationsRoute)
app.use(adminRoute)

// WebSocket con Socket.io
app.set('websocket', io);

const errorHandler = (error, req, res, next) => {
    console.error(error)
    res.status(500).json(`Algo ha salido mal: ${error}`)
    next(error)
};
app.use(errorHandler);

// Static files
app.use('/uploads', express.static(path.resolve('uploads')));
// const {pathname: root} = new URL('public', import.meta.url)
// app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => { 
    console.log("conectado dentro de io", {socket: socket})
    socket.emit("usuario conectado", "hola")
    socket.on("enviar-mensaje", (message) => {
        console.log(message, socket.id)

        socket.broadcast.emit("mensaje-desde-server", message) //manda a todos menos a mi
    })
    socket.on("escribiendo", () => {

        socket.broadcast.emit("escribiendo-desde-server") //manda a todos menos a mi
    })

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
})



export default app;