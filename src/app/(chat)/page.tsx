"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/login-form";
import { ChatLayout } from "@/components/chat/chat-layout";
import { generateUUID } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const id = generateUUID();

  useEffect(() => {
    const user = localStorage.getItem("ollama_user");
    if (user) {
      setOpen(false);
    }
  }, []);

  return (
    !open ? (
      <main className="flex h-[100vh] flex-col items-center justify-center">
        <ChatLayout 
          key={id}
          id={id}
          initialMessages={[]}
          navCollapsedSize={10}
          defaultLayout={[30, 160]}
        />
      </main>
    ) : (
      <main className="flex h-[100vh] flex-col items-center justify-center relative overflow-hidden bg-black">
        
        {/* Волны энергии */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle,_rgba(0,255,255,0.4),_transparent)]"
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,0,255,0.4),_transparent)]"
          animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.5, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Узлы */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-cyan-300 rounded-full shadow-2xl"
            initial={{ opacity: 0, scale: 0.5, x: Math.random() * 600 - 300, y: Math.random() * 600 - 300 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 2, 0.5],
              x: [Math.random() * 800 - 400, Math.random() * 800 - 400],
              y: [Math.random() * 800 - 400, Math.random() * 800 - 400],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Потоки данных */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[3px] h-[200px] bg-gradient-to-b from-cyan-400 to-transparent"
            initial={{ opacity: 0, y: -300, rotate: Math.random() * 360 }}
            animate={{ opacity: [0, 1, 0], y: [0, 400] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
            style={{ left: `${Math.random() * 100}%`, rotate: Math.random() * 360 }}
          />
        ))}

        {/* Вспышки */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 bg-white/20 rounded-full blur-3xl"
            initial={{ opacity: 0, scale: 0.5, x: Math.random() * 500 - 250, y: Math.random() * 500 - 250 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.5, 2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 1.2 }}
          />
        ))}

        <div className="relative z-10">
          <Dialog open={open}>
            <DialogContent 
              className="w-[400px] bg-white/10 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl"
              onInteractOutside={(e) => e.preventDefault()}
            >
              <DialogHeader className="items-center">
                <DialogTitle>
                  <Image src={"/enix.svg"} alt="Логотип" width={240} height={240} className="mb-2 dark:invert" />
                </DialogTitle>
                <DialogDescription className="text-white/90">
                  Введите ваши данные для входа в чат.
                </DialogDescription>
              </DialogHeader>
              <LoginForm setOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </div>
      </main>
    )
  );
}