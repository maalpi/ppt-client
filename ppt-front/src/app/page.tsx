'use client'

import React,{useState} from "react";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import DarkLightToggle from "@/components/Theme";
import { Navigation } from "@/components/Nav";

export default function Home() {
  const [username, setUsername] = useState(""); // Estado para o nome do usuário
  const router = useRouter();

  // Função de login
  const handleLogin = () => {
    // Armazena o nome do usuário no localStorage
    if (username) {
      localStorage.setItem("username", username);
      router.push("/users"); // Redireciona para a página de usuários online
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-between p-24">
      <Navigation />
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Entre com seu user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="user">user</Label>
              <Input
                id="user"
                type="user"
                placeholder="user"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Atualiza o estado
                required
              />
            </div>
            <Button type="submit" className="w-full" onClick={handleLogin}>
              Login
            </Button>
          </div>
        </CardContent>
    </Card>
    </main>
  );
}