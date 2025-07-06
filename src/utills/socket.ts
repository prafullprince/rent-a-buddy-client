import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    // secure: true,
});

export default socket;
// https://livekit-server-1.onrender.com
