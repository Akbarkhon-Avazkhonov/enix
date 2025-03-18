"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React from "react";
import InputMask from "react-input-mask";

const formSchema = z.object({
  username: z.string().min(2, { message: "Имя должно содержать минимум 2 символа." }),
  phone: z
    .string()
    .regex(/^\+998 \d{2} \d{3} \d{2} \d{2}$/, { message: "Введите телефон в формате +998 XX XXX XX XX." }),
  password: z.string().min(6, { message: "Пароль должен содержать минимум 6 символов." }),
});

interface LoginFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginForm({ setOpen }: LoginFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phone: "+998 ", // Устанавливаем "+998 " по умолчанию
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    localStorage.setItem("ollama_user", values.username);

    window.dispatchEvent(new Event("storage"));
    setOpen(false);
    router.push("/"); // Редирект после входа
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Имя */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input placeholder="Введите имя" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Телефон с фиксированным "+998 " */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Телефон</FormLabel>
              <FormControl>
                <InputMask
                  mask="+998 99 999 99 99"
                  value={field.value}
                  onChange={(e) => {
                    if (!e.target.value.startsWith("+998 ")) {
                      e.target.value = "+998 "; // Защита от удаления префикса
                    }
                    field.onChange(e);
                  }}
                  placeholder="+998 XX XXX XX XX"
                >
                  {(inputProps) => <Input type="tel" {...inputProps} />}
                </InputMask>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Пароль */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Введите пароль" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          Войти
        </Button>
      </form>
    </Form>
  );
}
