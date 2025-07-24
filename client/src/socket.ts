import { io } from 'socket.io-client';

const serverUrl = import.meta.env.VITE_UNMATCHED_DASHBOARD_SERVER_URL;
export const socket = io(serverUrl, { autoConnect: false });
