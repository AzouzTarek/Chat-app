// Polyfill for global in browser
if (typeof global === 'undefined') {
  var global = window;
}

import { Routes, Route, Navigate } from "react-router-dom";
import { Buffer } from 'buffer';
import process from 'process';
import randomBytes from 'randombytes';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import Chat from "./pages/Chat"; 
import Login from "./pages/login"; 
import Registre from "./pages/Registre";     
import Contact from "./pages/Contact"; 
import VideoChat from './components/chat/VideoChat';
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";

window.Buffer = Buffer;
window.process = process;

function App() {
  const { user } = useContext(AuthContext);
  
  const exampleBytes = randomBytes(16); // Just for demonstration

  return (
    <ChatContextProvider user={user}> 
      <NavBar />
      <Container>
        <Routes>
          <Route path="/" element={user ? <Chat /> : <Login />} />
          <Route path="/login" element={user ? <Chat /> : <Login />} />
          <Route path="/registrer" element={user ? <Chat /> : <Registre />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/video-chat/:id" element={<VideoChat />} />
        </Routes>
      </Container>
    </ChatContextProvider>
  );
}

export default App;
