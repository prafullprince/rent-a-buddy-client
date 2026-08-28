import { io } from "socket.io-client";

const socket = io("ws://localhost:8080", {
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    // secure: true,
});

export default socket;
// https://livekit-server-1.onrender.com
