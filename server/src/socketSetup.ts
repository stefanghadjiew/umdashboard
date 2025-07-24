import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

const clientPort = process.env.CLIENT_ORIGIN;
const allowedSocketMethods = ['GET','POST'];

export const createIoServer = (server: http.Server) => {
    const io = new Server(server , { cors: {
        origin: clientPort,
        methods: allowedSocketMethods
    } })

    return io;
}