visit the app through this link https://chattt-appp.vercel.app



😍😍This is an interesting Advance chat with features of video call, profie management, realtime chat, realtime add and remove user


Integrated Oauth google signin with JWT token authorization


Used webRTC for video call 


Used WebSocket for signalling, real time chat, add and remove user in realtime

I also have implemented dark and light theme for this chat app


![Screenshot (28)](https://github.com/panditshivammishra/MernChatApp/assets/109903290/656e6b81-d900-4bef-9978-95d7382943bd)



![Screenshot (27)](https://github.com/panditshivammishra/MernChatApp/assets/109903290/e30e25c5-dedf-4e3f-ad73-b3dce9168060)




![Screenshot (29)](https://github.com/panditshivammishra/MernChatApp/assets/109903290/a284c350-0333-4e89-bb11-690b97e990f1)









graph TD
    subgraph Client (React + Vite)
        direction LR
        UI_Pages["Pages (Home, ChatPage) - client/src/Pages"]
        UI_Components["Components (Login, Signup, MyChats, SingleChat, VideoCall) - client/src/components, client/src/Authentication, client/src/miscellaneous"]
        Context_State["ChatProvider (State Management) - client/src/Context/ChatProvider.jsx"]
        Axios_HTTP["Axios (HTTP Requests)"]
        SocketIO_Client["Socket.IO Client (Real-time)"]
        WebRTC_Peer["WebRTC Peer (Video/Audio) - client/src/components/Service/peer.jsx"]

        UI_Pages --> UI_Components
        UI_Components --> Context_State
        UI_Components -- HTTP --> Axios_HTTP
        Context_State -- WebSocket --> SocketIO_Client
        UI_Components -- Signaling --> SocketIO_Client
        UI_Components -- Media Stream --> WebRTC_Peer
    end

    subgraph Server (Node.js + Express)
        direction LR
        Express_App["Express App (server.js) - Server/server.js"]
        API_Routes["API Routes (user, chat, message) - Server/routes"]
        Controllers["Controllers (Logic) - Server/controllers"]
        Middleware["Middleware (Auth) - Server/middleware/authMiddleware.js"]
        SocketIO_Server["Socket.IO Server (Real-time & Signaling) - Server/server.js"]
        Mongoose_Models["Mongoose Models - Server/models"]

        Express_App --> API_Routes
        API_Routes --> Middleware
        Middleware --> Controllers
        Controllers --> Mongoose_Models
        Express_App -- Hosts --> SocketIO_Server
    end

    subgraph Database
        MongoDB["MongoDB (Data Storage)"]
    end

    %% Client to Server (HTTP)
    Axios_HTTP -- REST API Calls --> API_Routes

    %% Client to Server (WebSocket)
    SocketIO_Client -- WebSocket Connection --> SocketIO_Server

    %% Server to Database
    Mongoose_Models -- CRUD Operations --> MongoDB

    %% WebRTC P2P
    WebRTC_Peer <-. Direct P2P Media .-> WebRTC_Peer

    %% Interactions
    User[User] --> UI_Pages

    %% Key Flows
    User -- Login/Signup --> UI_Components
    UI_Components -- Auth Request (HTTP) --> Axios_HTTP
    Axios_HTTP -- /api/user/... --> API_Routes
    Controllers -- User Auth --> Mongoose_Models
    Mongoose_Models -- User Data --> MongoDB
    Controllers -- JWT Response --> UI_Components

    UI_Components -- Send Message (WebSocket) --> SocketIO_Client
    SocketIO_Client -- "new message" event --> SocketIO_Server
    SocketIO_Server -- Store Message --> Controllers
    Controllers -- Save Message --> Mongoose_Models
    Mongoose_Models -- Message Data --> MongoDB
    SocketIO_Server -- "message received" event --> SocketIO_Client
    SocketIO_Client -- Display Message --> UI_Components

    UI_Components -- Initiate Video Call (WebSocket for Signaling) --> SocketIO_Client
    SocketIO_Client -- "start-call" / WebRTC signals --> SocketIO_Server
    SocketIO_Server -- Relays WebRTC signals --> SocketIO_Client
    SocketIO_Client -- Establishes P2P --> WebRTC_Peer
