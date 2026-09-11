import { io } from "socket.io-client";
import { PUBLIC_API_BASE_URL } from "@/service/api";

const fallbackSocketUrl = (() => {
    const apiUrl = new URL(PUBLIC_API_BASE_URL);
    apiUrl.protocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";
    apiUrl.pathname = "/";
    apiUrl.search = "";
    apiUrl.hash = "";
    return apiUrl.toString();
})();

const socket = io(
    process.env.NEXT_PUBLIC_SOCKET_URL ||
        fallbackSocketUrl,
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
