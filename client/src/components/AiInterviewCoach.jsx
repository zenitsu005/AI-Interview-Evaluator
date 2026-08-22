import React, { useState, useEffect, useRef } from 'react';
import { sendCoachMessage } from '../services/api';
import voiceAssistant from '../services/voiceAssistant';
import {
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Bot,
} from 'lucide-react';

const QUICK_PROMPTS = [
  'Turn my weakest answer into a Top 1% response',
  'How do I structure a STAR response for behavioral rounds?',
  'How do I bounce back from a lower score?',
  'What areas should I prioritize practicing next?',
];

export default function AiInterviewCoach({ report, targetRole = 'Software Engineer', difficultyLevel = 'Intermediate' }) {
  const [messages, setMessages] = useState([
    {
      sender: 'mentor',
      text: "Hey there! I reviewed your interview breakdown. What questions or answers would you like to debrief, refine with the STAR method, or improve together?",
      quote: 'Action cures fear. Each simulated drill brings you closer to your target offer.',
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const speakText = (text) => {
    if (!isVoiceEnabled) return;
    voiceAssistant.speak(text, {
      persona: 'ai_mentor',
      rate: 1.0,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleSendMessage = async (textToSend = null) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessage = { sender: 'user', text: query, time: 'Just now' };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const res = await sendCoachMessage({
        coachPersona: 'ai_mentor',
        candidateMessage: query,
        interviewContext: {
          targetRole,
          difficultyLevel,
          overallScore: report?.overallScore,
          readiness: report?.readinessLevel,
          weaknesses: report?.weaknesses,
          strengths: report?.strengths,
        },
      });

      const replyText = res?.reply || "Keep pushing forward! Let's conquer the next problem together.";
      const mentorMessage = {
        sender: 'mentor',
        text: replyText,
        quote: res?.motivationalQuote,
        drill: res?.suggestedDrill,
        time: 'Just now',
      };

      setMessages((prev) => [...prev, mentorMessage]);
      speakText(replyText);
    } catch (e) {
      console.warn('AI Mentor communication error:', e);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'mentor',
          text: "I'm right here with you! Every mock drill builds real interview resilience and clarity.",
          time: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#131823] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl text-left">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <span>AI Mentor</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-950/80 text-teal-300 border border-teal-500/30 font-mono">
                Neural Voice AI
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive debriefing, STAR re-framing, and actionable interview guidance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsVoiceEnabled(!isVoiceEnabled);
              if (isSpeaking) voiceAssistant.stop();
            }}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isVoiceEnabled
                ? 'bg-teal-950/80 border-teal-500/40 text-teal-300'
                : 'bg-[#171E2D] border-white/10 text-slate-500'
            }`}
            title="Toggle Natural Voice Feedback"
          >
            {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{isVoiceEnabled ? 'Voice Active' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Chat Stream */}
      <div className="p-4 rounded-2xl bg-[#0D111A] border border-white/5 space-y-3.5 max-h-[320px] overflow-y-auto shadow-inner text-xs">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
          >
            <div
              className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-semibold shadow-md rounded-br-none'
                  : 'bg-[#131823] border border-white/10 text-slate-200 shadow-sm rounded-bl-none'
              }`}
            >
              {m.text}
            </div>

            {m.quote && (
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-[11px] font-sans italic max-w-[80%]">
                "{m.quote}"
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="p-3 bg-[#131823] border border-white/10 rounded-2xl text-teal-400 text-xs flex items-center gap-2 max-w-[140px]">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            className="text-[11px] px-3 py-1.5 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-teal-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Input Row */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask AI Mentor for advice, STAR reframing, or answer improvements..."
          className="flex-1 bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputText.trim()}
          className="py-3 px-5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask Mentor</span>
        </button>
      </div>
    </div>
  );
}
