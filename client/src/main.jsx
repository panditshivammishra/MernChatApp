import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ChatProvider from "./Context/ChatProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import {
BrowserRouter
} from "react-router-dom";
import { ChakraProvider,ColorModeScript } from '@chakra-ui/react'
import "./App.css";
import theme from './theme';




ReactDOM.createRoot(document.getElementById('root')).render(


  <ChakraProvider>
  <BrowserRouter>
     <ChatProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <GoogleOAuthProvider clientId="665826723970-mdd1kahmi7300dhsnpqu2eja4ehhau52.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
      </ChatProvider>
    </BrowserRouter>
      </ChakraProvider>

)
