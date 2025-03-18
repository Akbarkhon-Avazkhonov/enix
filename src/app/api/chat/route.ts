import { createOllama } from "ollama-ai-provider";
import { streamText, convertToCoreMessages, CoreMessage, UserContent } from "ai";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { messages, selectedModel, data, mode } = await req.json();
  const ollamaUrl = process.env.OLLAMA_URL;

  const ollama = createOllama({ baseURL: ollamaUrl + "/api" });

  if (mode === "image") {
    // Генерация изображения
    const prompt = messages[messages.length - 1]?.content;
    
    const response = await fetch(`https://api.enix.uz/generateImage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({text: prompt }),
    });

    const imageResult = await response.json();
    return new Response(JSON.stringify({ image: imageResult.url }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Генерация текста
  const initialMessages = messages.slice(0, -1);
  const currentMessage = messages[messages.length - 1];

  const messageContent: UserContent = [{ type: "text", text: currentMessage.content }];

  // Добавление изображений, если они есть
  data?.images?.forEach((imageUrl: string) => {
    const image = new URL(imageUrl);
    messageContent.push({ type: "image", image });
  });

  // Потоковая генерация текста
  const result = await streamText({
    model: ollama(process.env.OLLAMA_MODEL || ""),
    messages: [
      ...convertToCoreMessages(initialMessages),
      { role: "user", content: messageContent },
    ],
  });

  return result.toDataStreamResponse();
}
