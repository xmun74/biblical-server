/* const WebSocket = require("ws");
module.exports = (server) => {
  const wss = new WebSocket.Server({ server });
  wss.on("connection", (ws, req) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // 클라이언트 IP 알아내기
    console.log("새 클라이언트 접속", ip);
    // 클라이언트로부터 메시지 수신 시
    ws.on("message", (message) => {
      console.log(message.toString());
    });
    ws.on("error", (err) => {
      console.error(err);
    });
    ws.on("close", () => {
      console.log("클라이언트 접속 해제", ip);
      clearInterval(ws.interval);
    });
    // 3초마다 서버->클라이언트로 메시지 전송
    ws.interval = setInterval(() => {
      // OPEN 상태일때
      if (ws.readyState === ws.OPEN) {
        ws.send("서버에서 클라리언트로 메시지 전송");
      }
    }, 10000);
  });
};
 */
import http from "http";
import { Server } from "socket.io";

export default (server: http.Server) => {
  const io = new Server(server, {
    path: "/socket.io",
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });

  /* io.on("connection", (socket) => {
    const req = socket.request;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log("✅ 새 클라이언트 접속", ip, socket.id); //req.id
    socket.on("disconnect", () => {
      console.log("❌ 클라이언트 접속 해제", ip, socket.id);
      clearInterval(interval);
    });
    socket.on("error", (err) => {
      console.error(err);
    });
    socket.on("reply", (data) => {
      console.log(data);
    });
    const interval = setInterval(() => {
      socket.emit("news", "Hello Socket.IO");
    }, 5000);
  }); */
};
