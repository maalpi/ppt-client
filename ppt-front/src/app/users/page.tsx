"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Navigation } from "@/components/Nav";
import { Button } from "@/components/ui/button";
import socket from "@/utils/socket"; // Importando o socket compartilhado

import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableFooter, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";


export default function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState({});
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [chatRequests, setChatRequests] = useState([]); // Armazena as solicitações de chat recebidas
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    if (!storedUsername) {
      router.push("/");
      return;
    }

    setUsername(storedUsername);
    socket.emit("new-user", storedUsername);
    setConnected(true);

    // Recebe a lista de usuários online
    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    // Recebe um pedido de chat
    socket.on("chat-request", (fromUser) => {
      setChatRequests((prev) => [...prev, fromUser]);
      if (confirm(`${fromUser} quer iniciar um chat com você! Aceitar?`)) {
        socket.emit("accept-chat", { fromUser, toUser: storedUsername });
      }
    });

    // Redireciona ambos os usuários para a sala de chat particular
    socket.on("chat-start", (room) => {
      router.push(`/batepapo/${room}`); // Redireciona para a página de chat com o ID da sala
    });

    return () => {
      socket.off("online-users");
      socket.off("chat-request");
      socket.off("chat-start");
    };
  }, [router]);

  // Inicia uma conexão de chat com outro usuário
  const initiateChat = (socketId: string) => {
    socket.emit("initiate-chat", socketId);
  };

  return (
    <div className="flex justify-center top-10 items-center min-h-screen fixed w-full px-4">
      <Navigation />
      <div className="overflow-x-clip overflow-y-auto max-w-full max-h-[500px] shadow-md rounded-lg">
        <Table className="min-w-[200px] z-40">
          <TableCaption>Lista de usuários online</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px] px-4">Nome</TableHead>
              <TableHead className="w-[100px] hidden lg:table-cell px-4">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(onlineUsers).map((socketId) => (
              <TableRow key={socketId}>
                <TableCell>
                  <p>{onlineUsers[socketId]}</p>
                </TableCell>
                <TableCell>
                  {onlineUsers[socketId] === username ? (
                    <p>você</p>
                    ) : (
                      <Button className="h-[30px]" onClick={() => initiateChat(socketId)}>
                        Conectar
                      </Button>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="items-center">
            <TableRow>
              <TableCell colSpan={1}>Usuários online:</TableCell>
              <TableCell className="text-right">{Object.keys(onlineUsers).length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
