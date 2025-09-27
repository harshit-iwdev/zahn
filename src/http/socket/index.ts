import { io, Socket } from 'socket.io-client';
import { apiUrl } from '../../config/config';
import { toast } from 'react-toastify';

class SocketManager {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.token = token;
    this.socket = io(`http://localhost:3000/socket`, {
      // this.socket = io(`${apiUrl.replace('/api', '/socket')}`, {
      auth: {
        token: token
      },
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    this.setupEventListeners();
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket, this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('dashboard_data', (data) => {
      console.log('Dashboard data received:', data);
      // toast message
      toast.info(data.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });

      // Dispatch to Redux store here
    });

    this.socket.on('se_appointment_update', (data) => {
      console.log('Send appointment update received:', data);

      // toast message
      toast.success(data.notification.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });

      // Dispatch to Redux store here
    });

    this.socket.on('appointment_update', (data) => {
      console.log('Appointment update received:', data);
      // Dispatch to Redux store here
    });

    this.socket.on('notification', (data) => {
      console.log('Notification received:', data);
      // Show notification to user
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketManager = new SocketManager();
export default socketManager;
