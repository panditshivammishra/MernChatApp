import express from "express"
import dotenv from 'dotenv'
import {router} from "./routes/userRoutes.js"
import {chatRouter} from "./routes/chatRoutes.js"
import { connectDB } from "./Config/db.js"
import { messageRouter } from "./routes/messageRoutes.js"
import cors from "cors"
import { Server } from "socket.io"
import { createServer } from "http";
import { userInfo } from "os"
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
let users = {}
let SocketToId = new Map();
let chatHistory = {}; 
io.on("connection", (socket) => {
   
  socket.on("setup", (userId) => {
    console.log("I am in setUp");
    users[userId] = socket.id;
    SocketToId[socket.id] = userId;

    socket.join(userId);



    socket.emit("connected"); 
  });
 
  socket.on("join chat", (room) => {
    socket.join(room);
  
  });

  socket.on("typing", (room) => {
  socket.broadcast.to(room).emit("typing");
});

socket.on("stop typing", (room) => {
  socket.broadcast.to(room).emit("stop typing");
});

   

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
 


  //Video Calling signalling
  
  socket.on('join-room', (roomId) => {
    console.log("join room for video CAll as a calleee");
    const Id = socket.id;
     io.to(roomId).emit("user-connected", {roomId,Id});
    socket.join(roomId);
  });
   
  socket.on('start-call', (data) => {
   
    const { name, chatId, callerId, toRoom } = data;
  
    io.to(socket.id).emit("join-room", chatId);
    console.log("I am Joined Chat room as caller");
    socket.emit("Do-videoCall", chatId);
    io.to(toRoom).emit('incoming-call', { name, callerId, chatId });  

    
  });

  socket.on('call:user', (data) => {
    const { to, offer} = data;
    io.to(to).emit('call-incoming', { from:socket.id, offer });
  });
  socket.on("call-accepted", (data) => {
    const { to, ans } = data;
    io.to(to).emit("call-accepted", { from: socket.id, ans });
  })
  
//   socket.off('user-connected', () => {
//      console.log(`I am leaving the room with id in userConnected ${callRoomId} ans socket id ${to}`);
//     socket.leave(callRoomId);
// })

   socket.on("peer:nego:needed", ({ to, offer }) => {
    // console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {

    // console.log("peer:nego:done", ans);
  
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
  // socket.on('accept-call', (data) => {
  //   const { roomId } = data;
  //   io.to(roomId).emit('call-accepted');
  // });

  // socket.on('decline-call', (data) => {
  //   const { roomId, callerId } = data;
  //   io.to(roomId).emit('call-declined', { callerId });
  // });

  socket.on('end-call', (from) => {
   

    io.to(from).emit('end-call', socket.id);
  });


  socket.on('leave-room', (roomId) => {
    console.log(`I am leaving the room with id ${roomId} and socketID ${socket.id}`);
    socket.leave(roomId);
  
  })
  
  socket.on('leaveRoom', ({ checkCallChat, to}) => {
    console.log(`socket of callee leaving room ${checkCallChat} before joining again the same room ${to}`);
    socket.leave(checkCallChat);
})


  
  
  
  
  







  
  socket.on('registerChat', ({ from, to }) => {
        console.log("I am in register chat")
        if (!chatHistory[from]) {
            chatHistory[from] = [];
        }
        if (!chatHistory[to]) {
            chatHistory[to] = [];
        }
        if (!chatHistory[from].includes(to)) {
            chatHistory[from].push(to);
        }
        if (!chatHistory[to].includes(from)) {
            chatHistory[to].push(from);
        }
        
    });

 

    socket.on('onlineUser', (userId) => {
    console.log("User online:", userId);
    if (chatHistory[userId]) {
      chatHistory[userId].forEach((connectedUserId) => {
        if (users[connectedUserId]) {
          io.to(users[connectedUserId]).emit('user-online', userId);
        }
      });
    }
  });
  

  
  socket.on("i also online",({userId,from}) => {
    console.log("i also online");
    // console.log(users[userId])
    console.log(userId);
  socket.to(userId).emit('make me online',from)

})
  
  
  




  
  socket.on("disconnect", () => {
    console.log(SocketToId[socket.id]);
  if (chatHistory[SocketToId[socket.id]]) {
      chatHistory[SocketToId[socket.id]].forEach((connectedUserId) => {
          io.to(connectedUserId).emit('offline-him', SocketToId[socket.id]);
      });
    }
 

     for (const [userId, socketId] of Object.entries(users)) {
       if (socketId === socket.id) {
        delete users[userId];
        console.log(`User ${userId} removed from users.`);
        break;
      }
    }
    console.log("USER DISCONNECTED");      
  });
});  
httpserver.listen(PORT, console.log(`connected at port ${PORT}`));   
  