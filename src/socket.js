import { io } from "socket.io-client";

const URL = "http://localhost:5050";

export const socket = io(URL, {
  autoConnect: false,
});

export const connectionManager = (socket) => {
  return {
    connect: () => {
      socket.connect();
    },

    disconnect: () => {
      socket.disconnect();
    },
  };
};
// socketManager

export const socketManager = {
  listeners: [],

  addListener: (event, callback) => {
    socket.on(event, callback);
    console.log(callback);
    socketManager.listeners.push(event);
  },

  removeListener: (event) => {
    socket.off(event);
    socketManager.listeners = socketManager.listeners.filter(
      (listener) => listener !== event
    );
  },

  emitToMountedComponents: (event, data) => {
    socketManager.listeners.forEach((listener) => {
      socket.emit(event, data);
    });
  },
};
