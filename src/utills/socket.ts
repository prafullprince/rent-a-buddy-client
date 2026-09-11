import { io } from "socket.io-client";
import { BASE_URL } from "@/service/api";

const socket = io(
    process.env.NEXT_PUBLIC_SOCKET_URL ||
        BASE_URL.replace(/\/api\/?$/, "").replace(/^http/, "ws"),
    {
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    // secure: true,
    }
);

export default socket;
// https://livekit-server-1.onrender.com
