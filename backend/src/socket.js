function registerSocketEvents(io) {
  io.on("connection", (socket) => {
    console.log(`🟢 Usuário conectado: ${socket.id}`);

    socket.on("send_message", (data) => {
      io.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Usuário desconectado: ${socket.id}`);
    });
  });
}

module.exports = registerSocketEvents;
