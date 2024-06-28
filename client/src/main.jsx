import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ChatProvider from "./Context/ChatProvider";
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
    <App />
  
      </ChatProvider>
    </BrowserRouter>
      </ChakraProvider>

)
