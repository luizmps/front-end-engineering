import { useEffect, useState } from "react";
import { socket } from "@/service/socket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ChatMessage } from "@/types/ChaMessage";

export default function App() {
  const [username, setUsername] = useState(() => localStorage.getItem("chat_username") || "");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(username);

  useEffect(() => {
    socket.on("receive_message", (data: ChatMessage) => {
      setChat((prev) => [...prev, data]);
    });
    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("send_message", { username, message });
      setMessage("");
    }
  };

  const saveNewName = () => {
    if (newName.trim() && newName !== username) {
      setUsername(newName);
      localStorage.setItem("chat_username", newName);
      setChat((prev) => [
        ...prev,
        { system: true, message: `${username} mudou o nome para ${newName}` },
      ]);
    }
    setEditingName(false);
  };

  if (!username) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-sm">
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">Qual seu nome?</h2>
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Button onClick={saveNewName}>Entrar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Chat</h1>
            {editingName ? (
              <div className="flex gap-2">
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
                <Button onClick={saveNewName}>Salvar</Button>
              </div>
            ) : (
              <Button onClick={() => setEditingName(true)}>
                Trocar nome
              </Button>
            )}
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto bg-white p-2 rounded border">
            {chat.map((msg, i) =>
              msg.system ? (
                <div key={i} className="text-center text-xs italic text-gray-500">
                  {msg.message}
                </div>
              ) : (
                <div key={i} className="text-sm">
                  <strong>{msg.username}:</strong> {msg.message}
                </div>
              )
            )}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2">
            <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Mensagem..." />
            <Button type="submit">Enviar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
