import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Award, HelpCircle, ShieldAlert } from "lucide-react";
import { ChatMessage } from "../types";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "assistant",
      content: "Halo! Saya adalah **Exnees AI Assistant**, asisten cerdas serbabisa Anda. Saya siap menjawab **pertanyaan random apa pun** di luar trading, menjelaskan seluk-beluk **Exnees**, membantu konsep trading, hingga membimbing trader pemula yang menghadapi kendala seperti **susah login, masalah mendaftar, atau pesan error lainnya**. Ada yang bisa saya bantu sekarang?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Cara mengatasi susah login/daftar?",
    "Kenapa 'Akses Ditolak (403)' di Admin?",
    "Tanya hal random bebas!",
    "Berapa saldo modal simulasi saya?",
    "Apa saja fitur andalan Exnees?",
    "Cara baca chart TradingView?",
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send conversational history context to the server-side API proxy
      const historyContext = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: historyContext }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil respon dari asisten AI.");
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Maaf ya, koneksi asisten AI sedang sibuk. Pastikan internet Anda aktif dan silakan ulangi kembali!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="chatbot-root-widget">
      {/* Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="chatbot-trigger-btn"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-3 bg-[#FFB100] text-black px-4 py-3 rounded-full hover:bg-[#e09c00] transition-colors shadow-2xl font-sans font-semibold text-sm cursor-pointer border border-[#cca125]"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare className="w-5 h-5 text-black" />
            <span>Tanya Asisten AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-panel"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[360px] sm:w-[400px] h-[520px] bg-[#141414] border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden font-sans"
          >
            {/* Blue-Gold Header */}
            <div className="px-4 py-3 bg-[#111111] border-b border-white/5 flex items-center justify-between" id="chatbot-header">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded bg-[#FFB100] flex items-center justify-center font-bold text-neutral-900 text-sm">
                    EX
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#FFB100] rounded-full border-2 border-neutral-950 animate-pulse"></span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-100 flex items-center font-sans">
                    Exnees AI Assistant
                    <Award className="w-3.5 h-3.5 text-[#FFB100] ml-1" />
                  </h4>
                  <span className="text-[10px] text-neutral-400">Mentor Trading Protektif & Ramah</span>
                </div>
              </div>
              <button
                id="chatbot-close-btn"
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-neutral-200 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a] scrollbar-thin scrollbar-thumb-neutral-850" id="chatbot-messages-container">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  id={`chat-msg-${msg.id}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#141414] border border-white/10 text-neutral-100 rounded-tr-none"
                        : "bg-[#111111] border border-white/5 text-neutral-300 rounded-tl-none font-sans"
                    }`}
                  >
                    {/* Simplified Markdown Bold translator */}
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.content.split("**").map((text, i) =>
                        i % 2 === 1 ? <strong key={i} className="text-[#FFB100] font-sans font-bold">{text}</strong> : text
                      )}
                    </div>
                    <span className="block text-[9px] text-neutral-500 text-right mt-1.5 font-mono uppercase">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start" id="chatbot-typing-indicator">
                  <div className="bg-[#111111] border border-white/5 text-neutral-300 rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center space-x-1.5 font-sans">
                    <span className="w-1.5 h-1.5 bg-[#FFB100] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-[#FFB100] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-[#FFB100] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Hints (Visible when messages is short / empty) */}
            {messages.length < 5 && (
              <div className="px-4 py-2 bg-[#111111] border-t border-white/5 flex flex-wrap gap-1.5" id="chatbot-quick-replies">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    id={`chatbot-quick-${idx}`}
                    key={q}
                    disabled={isLoading}
                    onClick={() => handleSend(q)}
                    className="flex items-center space-x-1 text-[10px] sm:text-xs text-neutral-300 bg-[#141414] hover:bg-neutral-800 border border-white/5 rounded-full px-2.5 py-1 transition-all cursor-pointer hover:border-white/10"
                  >
                    <HelpCircle className="w-3 h-3 text-[#FFB100]" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              id="chatbot-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="px-4 py-3 bg-[#111111] border-t border-white/5 flex items-center space-x-2"
            >
              <input
                id="chatbot-input-field"
                type="text"
                disabled={isLoading}
                placeholder="Tanyakan pola analisis harian..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#FFB100] transition-colors font-sans"
                maxLength={450}
              />
              <button
                id="chatbot-send-btn"
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                  input.trim() && !isLoading
                    ? "bg-[#FFB100] text-black hover:bg-[#e09c00]"
                    : "bg-[#141414] text-neutral-600 border border-white/5 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
