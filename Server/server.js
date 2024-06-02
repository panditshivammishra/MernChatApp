import express from "express"
import dotenv from 'dotenv'
import {router} from "./routes/userRoutes.js"
import {chatRouter} from "./routes/chatRoutes.js"
import { connectDB } from "./Config/db.js"
import { messageRouter } from "./routes/messageRoutes.js"
import cors from "cors"
import { Server } from "socket.io"
import { createServer } from "http";
dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/user", router);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

const httpserver = createServer(app);


const io =new Server(httpserver, {
  pingTimeout: 60000,
    cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  },
});

io.on("connection", (socket) => {
  console.log(`connected with id ${socket.id}`);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
httpserver.listen(PORT, console.log(`connected at port ${PORT}`));