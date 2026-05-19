import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Msg {
  role: "user" | "ai";
  text: string;
}

const initial: Msg[] = [
  {
    role: "ai",
    text: "Hi Alex — I'm Sentinel. I can explain incidents, summarize reports, or suggest fixes. What's on your mind?",
  },
];

const suggestions = [
  "Summarize last 24h incidents",
  "Why did /checkout latency spike?",
  "Suggest fix for auth-service",
];

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text:
            "Root cause: connection pool saturation on payments-db. I've drafted a healing playbook: scale replicas +2 and recycle idle connections. Want me to apply it?",
        },
      ]);
    }, 700);
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
                  <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online · gpt-healing-v2
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      m.role === "user"
                        ? "gradient-primary text-white rounded-br-sm"
                        : "bg-secondary/70 rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
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
              <Button type="submit" size="icon" className="gradient-primary shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
