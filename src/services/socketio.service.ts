import { io, Socket } from "socket.io-client";

class SocketioService {
  socket: Socket | null;
  constructor() {
    this.socket = null;
  }

  setupSocketConnection() {
    this.socket = io(import.meta.env.VITE_SOCKET_URL);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  subscribeToEvent(event: string, cb: (data?: any) => void) {
    if (this.socket) {
      this.socket.on(event, (data) => {
        cb(data);
      });
    }
  }
}

export default new SocketioService();
