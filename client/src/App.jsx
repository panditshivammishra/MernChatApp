import React, { useEffect } from "react";
import Home from "./Pages/Home";
import { Routes, Route } from "react-router-dom";
import { useColorMode } from "@chakra-ui/react";
import Chatpage from "./Pages/Chatpage";
const App = () => {
  const { colorMode } = useColorMode();
  useEffect(() => {
    if (colorMode === "light") {
      document.body.style.backgroundColor = "#caeae9";
    }
  }, [colorMode]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/chat" element={<Chatpage />}></Route>
      </Routes>
    </>
  );
};

export default App;
