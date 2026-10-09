import React, { useState } from 'react';
import { Bot, Send, Shield, Sparkles, X } from 'lucide-react';
import {
  AssistantMessage,
  NavigationTab,
  ScreenShieldState,
} from '../types/screenshield';
import { ScreenShieldApi } from '../services/api';

interface AIAssistantPanelProps {
  state: ScreenShieldState;
  onRunScan: () => void;
  onProtectAll: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

const SUGGESTIONS = [
  { label: '🔍 Scan my screen', prompt: 'Scan my screen now' },
  { label: '🛡 Protect sensitive areas', prompt: 'Protect sensitive areas on my screen' },
  { label: '📊 Explain today\'s risks', prompt: 'Explain today\'s privacy risks in simple language' },
  { label: '⚙ Change privacy settings', prompt: 'How should I configure my privacy protection settings?' },
];

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  state,
  onRunScan,
  onProtectAll,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [recommendationDismissed, setRecommendationDismissed] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      text: `How can I help protect your screen? Your Privacy Score is currently ${state.privacyScore}/100 with ${
        state.detections.filter((d) => d.isProtected).length
      } sensitive regions shielded.`,
      timestamp: 'Now',
    },
  ]);

  const handleSend = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || isThinking) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toTimeString().slice(0, 5),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    const lower = trimmed.toLowerCase();
    if (lower.includes('scan')) {
      onRunScan();
    } else if (lower.includes('protect sensitive')) {
      onProtectAll();
    } else if (lower.includes('change privacy settings')) {
      onNavigate('protection');
    }

    const replyText = await ScreenShieldApi.askAssistant(trimmed);
    const botMsg: AssistantMessage = {
      id: `bot-${Date.now()}`,
      role: 'assistant',
      text: replyText,
      timestamp: new Date().toTimeString().slice(0, 5),
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsThinking(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-[0_0_24px_rgba(6,182,212,0.4)] hover:shadow-[0_0_32px_rgba(6,182,212,0.65)] hover:scale-[1.02] transition-all cursor-pointer"
        >
          <span className="text-base leading-none">🤖</span>
          <span>ASK AI</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 rounded-2xl glass-card border border-cyan-500/35 shadow-2xl overflow-hidden flex flex-col animate-fadeIn">
          {/* Panel Header */}
          <div className="px-4 py-3.5 bg-slate-950/85 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span>🤖 SCREENSHIELD AI ASSISTANT</span>
                </div>
                <div className="text-[10px] font-mono text-emerald-400">
                  On-Device Privacy Intelligence
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI Assistant"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Proactive Detection Card (Section 22) */}
          {!recommendationDismissed && (
            <div className="m-3 p-3.5 rounded-xl bg-rose-950/35 border border-rose-500/45 space-y-2 text-xs">
              <div className="font-semibold text-slate-100">
                🤖 I detected a password field on your screen.
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span>
                  Risk: <strong className="text-rose-400">CRITICAL</strong>
                </span>
                <span>·</span>
                <span className="text-slate-300">
                  Recommended: Auto-blur region
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onProtectAll();
                    setRecommendationDismissed(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Protect</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRecommendationDismissed(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs cursor-pointer"
                >
                  Ignore
                </button>
              </div>
            </div>
          )}

          {/* Conversation History */}
          <div className="p-4 space-y-3 max-h-56 overflow-y-auto text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-medium'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-cyan-300 font-mono text-[11px]">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>🧠 Analyzing screen telemetry...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 pb-3 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => handleSend(s.prompt)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-200 transition-colors cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-slate-950/85 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              aria-label="Send message"
              className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
