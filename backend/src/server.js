const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const registerSocketEvents = require("./socket");
const messageRoutes = require("./routes/messages");

function startServer() {
  const app = express();
  const server = http.createServer(app);

  app.use(cors());
  app.use(express.json());

  app.use("/api/messages", messageRoutes);

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // frontend
      methods: ["GET", "POST"]
    }
  });

  registerSocketEvents(io);

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = { startServer };
