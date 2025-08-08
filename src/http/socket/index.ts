import { io } from "socket.io-client";
import { apiUrl } from "../../config/config";

export const createSocket = (token) => {
  return io(`${apiUrl}?token=${token}`, {
    autoConnect: false,
  });
};
