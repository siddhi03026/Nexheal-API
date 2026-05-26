import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, X, Loader2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface Msg {
  role: "user" | "ai";
  text: string;
}

const suggestions = [
  "Summarize last 24h incidents",
  "Why did payments-api latency spike?",
  "Suggest fix for auth-service",
];

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const fetchHistory = async () => {
    try {
      const data = await api.get<any>("/chatbot/history");
      if (data && data.messages) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error("Error loading chat history", e);
    }
  };

  const speak = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Prefer an English voice for consistent output language
    const preferredVoice = voices.find((v) => v.lang?.startsWith("en") && v.name.includes("Google"))
      || voices.find((v) => v.lang?.startsWith("en") && /female|woman/i.test(v.name))
      || voices.find((v) => v.lang?.startsWith("en"));
    if (preferredVoice) utterance.voice = preferredVoice;

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (open) {
      fetchHistory();
    }
  }, [open]);

  useEffect(() => {
    if (!window.speechSynthesis) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const send = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg = { role: "user" as const, text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await api.post<any>("/chatbot/message", { message: text });
      const aiMsg = { role: "ai" as const, text: res.text };
      setMessages((m) => [...m, aiMsg]);
      speak(res.text);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "Sorry, I am having trouble connecting to the AI models. Please try again." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-2xl gradient-primary grid place-items-center glow-primary shadow-elevated"
        aria-label="Open AI assistant"
      >
        {open ? <X className="h-6 w-6 text-white" /> : <Bot className="h-6 w-6 text-white" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="fixed bottom-24 right-5 z-40 w-[calc(100vw-2.5rem)] sm:w-96 h-[520px] glass-strong rounded-2xl flex flex-col overflow-hidden shadow-elevated"
          >
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Sentinel AI</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online · Groq Llama3
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground"
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  if (voiceEnabled) window.speechSynthesis.cancel();
                }}
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line leading-relaxed ${
                      m.role === "user"
                        ? "gradient-primary text-white rounded-br-sm"
                        : "bg-secondary/70 rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm bg-secondary/70 rounded-bl-sm flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Sentinel is analyzing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-border hover:border-primary/50 hover:bg-primary/10 transition text-muted-foreground hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="p-3 border-t border-border flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your APIs..."
                className="flex-1 h-10 px-3 rounded-lg bg-secondary/60 border border-border text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
              <Button type="submit" size="icon" className="gradient-primary shrink-0" disabled={isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
