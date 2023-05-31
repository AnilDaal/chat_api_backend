import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import nodeNotifier from "node-notifier";

const app = express();

const port = process.env.PORT || 8900;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => {
    user.socketId !== socketId;
  });
};

const userIn = (socketId) => {
  return users.some((user) => user.socketId === socketId);
};

io.on("connection", (socket) => {
  console.log("connection done...");
  console.log(socket.id);

  socket.on("chat", (payload) => {
    console.log(payload);
    nodeNotifier.notify({
      title: payload.name,
      message: payload.message,
      sound: true,
      wait: true,
      timeout: 3,
      icon: `https://pacifencesolutions.com/wp-content/uploads/2022/08/pacifence-solutions-logo.webp`,
    });

    io.emit("chat", payload);
  });

  socket.on("addUser", (userId) => {
    if (userId) {
      addUser(userId, socket.id);
    }
    io.emit("getUser", users);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeUser(socket.id);
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
