import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();

const port = process.env.PORT || 5000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

io.on("connection", (socket) => {
  console.log("connection done...");
  console.log(socket.id);

  socket.on("chat", (payload) => {
    console.log("this is payload", payload);
    addUser("i-4342", socket.id);
    +socket.emit("chat", payload);
  });
});

// io.disconnectSockets();

// io.engine.on("connection_error", (err) => {
//   console.log(err.req); // the request object
//   console.log(err.code); // the error code, for example 1
//   console.log(err.message); // the error message, for example "Session ID unknown"
//   console.log(err.context);
// });

httpServer.listen(8900, () => {
  console.log(`Server is running on port ${port}`);
});
