// Programmed by Pymite6941
import { createServer } from "node::http";
import next from "next";
import { Server } from "socket.io";

// Setting server basics
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({dev,hostname,port});
const handler = app.getRequestHandler();
app.prepare().then(() => {
    const httpServer = createServer(handler);
    const io = new Server(httpServer);
    io.on("connection",(socket) => {
        //
    })
})