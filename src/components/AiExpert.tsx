import { useState, useRef, useEffect } from "react";
import { FAQ_PROMPTS } from "../data";
import { ChatMessage } from "../types";
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Trash2, 
  HelpCircle,
  AlertCircle
} from "lucide-react";

export default function AiExpert() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Welcome! I am your interactive **Battery Energy Storage System (BESS)** specialist. I can assist with electrochemical chemistry comparisons (LFP vs NMC vs Na-ion), BMS telemetry configs, thermal cooling pathing (TMS), bidirection multi-port inverter sizing, or grid optimization rules. \n\nHow can I help engineer or optimize your energy system today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);
    setErrorMessage(null);

    try {
      const chatHistory = messages.map((m) => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: chatHistory,
          message: textToSend
        })
      });

      if (!res.ok) {
        throw new Error("Chat engine encountered an error. Please verify secrets config.");
      }

      const data = await res.json();
      
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        text: data.text,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to reach AI consultant interface.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: "Chat database successfully cleared. Please ask about battery storage chemistry safety guidelines, system design considerations, or peak shaving economics.",
        timestamp: new Date()
      }
    ]);
    setErrorMessage(null);
  };

  // Crude markdown-to-html helper safe for static client-side
  const renderMarkdown = (text: string, isAssistant: boolean) => {
    const boldColorClass = isAssistant ? "text-slate-950" : "text-cyan-950";
    const bulletColorClass = isAssistant ? "text-slate-600" : "text-cyan-900";

    // Bold matches
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, `<strong class="${boldColorClass} font-semibold">$1</strong>`);
    
    // Bullet points conversion
    formattedText = formattedText.split('\n').map((line) => {
      if (line.trim().startsWith('- ')) {
        return `<li class="ml-4 list-disc text-xs ${bulletColorClass} my-1">${line.trim().substring(2)}</li>`;
      }
      if (line.trim().startsWith('* ')) {
        return `<li class="ml-4 list-disc text-xs ${bulletColorClass} my-1">${line.trim().substring(2)}</li>`;
      }
      return line;
    }).join('\n');

    // Handle line breaks
    formattedText = formattedText.replace(/\n/g, '<br />');

    const textColorClass = isAssistant ? "text-slate-700" : "text-cyan-900";

    return <div className={`text-xs md:text-sm ${textColorClass} leading-relaxed`} dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 tracking-tight">
            AI BESS System Expert
          </h2>
          <p className="text-xs text-slate-550 max-w-xl">
            A state-commissioned server-gated consultant built with Gemini, optimized to assist grid engineers with thermal stability parameters, investment feasibility, and regulatory concerns.
          </p>
        </div>
        <button
          onClick={clearChat}
          id="clear-chat-btn"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 bg-white hover:text-slate-900 hover:bg-slate-50 shadow-sm transition-colors cursor-pointer"
          title="Clear Conversation History"
        >
          <Trash2 className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Reset Dialogue</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Suggested Quick Question Side Rail */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-4 rounded-2xl space-y-3 bg-white border-slate-200 shadow-sm">
            <h4 className="text-xs uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-cyan-600" />
              Suggested Queries
            </h4>
            <p className="text-[11px] text-slate-555 leading-relaxed">
              Click any blueprint below to instantly consult with the AI on advanced electrochemical or mechanical topics.
            </p>
            <div className="space-y-2">
              {FAQ_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  id={`prompt-chip-${i}`}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={loading}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-cyan-500/40 hover:bg-slate-100/30 hover:shadow-sm transition-all text-xs text-slate-700 flex items-start gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Primary Interactive Chat Terminal Card */}
        <div className="lg:col-span-8 glass-panel rounded-2xl flex flex-col h-[520px] overflow-hidden bg-white border-slate-200 shadow-sm">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-600 animate-pulse" />
              <span className="text-xs font-mono font-semibold text-slate-705">BESS System Expert Terminal v2.4</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-650 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              Consultant Online
            </span>
          </div>

          {/* Dialogue list panel */}
          <div 
            ref={listRef} 
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-behavior-smooth bg-slate-50/30"
          >
            {messages.map((m) => {
              const isAssistant = m.role === "assistant";
              return (
                <div 
                  key={m.id} 
                  className={`flex gap-3.5 max-w-[85%] ${isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isAssistant ? "bg-cyan-50 text-cyan-700 border border-cyan-150" : "bg-emerald-50 text-emerald-700 border border-emerald-150"
                  }`}>
                    {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className={`p-3.5 rounded-2xl ${
                      isAssistant 
                        ? "bg-white border border-slate-200 rounded-tl-none shadow-sm" 
                        : "bg-cyan-50 border border-cyan-150 rounded-tr-none"
                    }`}>
                      {renderMarkdown(m.text, isAssistant)}
                    </div>
                    <span className="text-[9px] font-mono text-slate-450 block px-1">
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3.5 mr-auto max-w-[85%] animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-705 border border-cyan-150 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">Synthesizing telemetry data...</span>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Submission Input Box */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }} 
            className="p-3 border-t border-slate-150 bg-slate-50/85 flex gap-2"
          >
            <input
              type="text"
              id="chat-input-text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about round-trip efficiency (RTE), thermal management, or sizing limits..."
              className="flex-1 bg-white px-4 py-2.5 text-xs border border-slate-250/70 rounded-xl text-slate-800 placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/5 transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              id="chat-submit-btn"
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-emerald-650 rounded-xl font-semibold text-xs text-white hover:brightness-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-cyan-500/10"
            >
              <Send className="w-3.5 h-3.5 text-white" />
              <span className="text-white hidden sm:inline">Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
