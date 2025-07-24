import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerSocketHandlers } from './registerSocketHandlers';
import { createIoServer } from './socketSetup';
dotenv.config();

const PORT = process.env.PORT ?? 3001;
const clientPort = process.env.CLIENT_ORIGIN;

const app = express();

app.use(express.json());
app.use(cors({origin: clientPort}));

const server = http.createServer(app);
const io = createIoServer(server);

io.on('connection', (socket) => registerSocketHandlers(socket, io))

server.listen(PORT, () => {
    console.log('Server running on PORT:', PORT);
})