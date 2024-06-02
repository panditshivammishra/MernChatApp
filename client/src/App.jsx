import React from 'react'
import Home from "./Pages/Home";
import { Routes, Route } from 'react-router-dom';
import Chatpage from './Pages/Chatpage';
const App = () => {
  return (
    <>
          <Routes>
              <Route path="/" element={<Home/>}></Route>
              <Route path="/chat" element={<Chatpage/>}></Route>
          </Routes>
    </>
  )
}

export default App
