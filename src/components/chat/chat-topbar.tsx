"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { HamburgerMenuIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { Sidebar } from "../sidebar";
import { Message } from "ai/react";
import useChatStore from "@/app/hooks/useChatStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChatTopbarProps {
  isLoading: boolean;
  chatId?: string;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export default function ChatTopbar({
  isLoading,
  chatId,
  messages,
  setMessages,
}: ChatTopbarProps) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = React.useState(false); // Состояние для OTP окна
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>(""); // Состояние для OTP
  const selectedModel = useChatStore((state) => state.selectedModel);
  const setSelectedModel = useChatStore((state) => state.setSelectedModel);

  const handleCloseSidebar = () => {
    setSheetOpen(false);
  };

  const handlePremiumClick = () => {
    setDialogOpen(true);
  };

  const handlePayment = () => {
    console.log("Processing payment with card:", cardNumber, "and expiry:", expiryDate);
    setDialogOpen(false);
    setOtpDialogOpen(true); // Открываем OTP окно
  };

  const handleOtpConfirm = () => {
    console.log("OTP confirmed:", otpCode);
    setOtpDialogOpen(false);
    // Здесь можно добавить логику подтверждения оплаты
  };

  // Функция форматирования номера карты
  const formatCardNumber = (value: string): string => {
    const digitsOnly = value.replace(/\D/g, "");
    const limitedDigits = digitsOnly.slice(0, 16);
    const formatted = limitedDigits
      .match(/.{1,4}/g)
      ?.join(" ")
      .trim();
    return formatted || "";
  };

  // Функция форматирования срока действия
  const formatExpiryDate = (value: string): string => {
    const digitsOnly = value.replace(/\D/g, "");
    const limitedDigits = digitsOnly.slice(0, 4);
    if (limitedDigits.length <= 2) return limitedDigits;
    return `${limitedDigits.slice(0, 2)}/${limitedDigits.slice(2)}`.trim();
  };

  // Функция форматирования OTP
  const formatOtpCode = (value: string): string => {
    const digitsOnly = value.replace(/\D/g, "");
    return digitsOnly.slice(0, 6); // Ограничиваем до 6 цифр
  };

  // Обработчики изменения ввода
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setExpiryDate(formattedValue);
  };

  const handleOtpCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatOtpCode(e.target.value);
    setOtpCode(formattedValue);
  };

  return (
    <div className="w-full flex px-4 py-6 items-center justify-between lg:justify-center">
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger>
          <HamburgerMenuIcon className="lg:hidden w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="left">
          <Sidebar
            chatId={chatId || ""}
            isCollapsed={false}
            isMobile={false}
            messages={messages}
            closeSidebar={handleCloseSidebar}
          />
        </SheetContent>
      </Sheet>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="w-[300px] bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
            onClick={handlePremiumClick}
            disabled={isLoading}
          >
            <StarFilledIcon className="w-5 h-5" />
            <span>Получить Премиум</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-background p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              Оформление Премиум подписки
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Сумма к оплате:</Label>
              <span className="text-lg font-bold text-cyan-500">15 000 сум</span>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cardNumber" className="text-sm font-medium">
                Номер карты
              </Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full"
                maxLength={19}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiryDate" className="text-sm font-medium">
                Срок действия
              </Label>
              <Input
                id="expiryDate"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                className="w-full"
                maxLength={5}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paymentMethod" className="text-sm font-medium">
                Способ оплаты
              </Label>
              <Select>
                <SelectTrigger id="paymentMethod" className="w-full">
                  <SelectValue placeholder="Выберите способ оплаты" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payme">Payme</SelectItem>
                  <SelectItem value="click">Click</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handlePayment}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
            >
              Оплатить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно для OTP */}
      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent className="sm:max-w-[350px] bg-background p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              Введите OTP-код
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="otpCode" className="text-sm font-medium text-center">
                Код из 6 цифр
              </Label>
              <Input
                id="otpCode"
                value={otpCode}
                onChange={handleOtpCodeChange}
                placeholder="123456"
                className="w-full text-center text-lg font-mono"
                maxLength={6}
              />
            </div>
            <Button
              onClick={handleOtpConfirm}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
            >
              Подтвердить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}