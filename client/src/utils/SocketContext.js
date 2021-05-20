import React, { useState, createContext } from "react";
import io from "socket.io-client";
export const SocketContext = createContext(null);

const socket = io(window.location.hostname==="localhost"?"http://localhost:5000":"https://letstreamiitr.herokuapp.com", {
  query: {
    token: localStorage.getItem('accesstoken')
  }
});
//const socket = null;
export const SocketProvider = ({ children }) => {
  const [Socket, setSocket] = useState(socket);

  return (
    <SocketContext.Provider value={{ Socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};


export default SocketProvider;