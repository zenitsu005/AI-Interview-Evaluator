import React, { useState, useEffect, useRef } from 'react';
import { sendCoachMessage } from '../services/api';
import voiceAssistant from '../services/voiceAssistant';
import {
  MessageSquare,
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  User,
  Bot,
  Zap,
  Star,
  Flame,
  Award,
  ChevronRight,
} from 'lucide-react';

const COACH_PERSONAS = [
  {
    id: 'maya',
    name: 'Coach Maya',
    title: 'Principal FAANG Interview Mentor',
    badge: 'Empathetic & Energizing',
    avatar: '👩‍🏫',
    style: 'border-amber-500/30 bg-amber-950/60 text-amber-300',
    welcome: "Hey there! I looked at your interview breakdown. Remember: every single top engineer has had rough interview simulations. What matters isn't where you start—it's how fast you calibrate. I'm here 24/7 to turn your gaps into your biggest strengths. How are you feeling about the session?",
  },
  {
    id: 'alex',
    name: 'Coach Alex',
    title: 'Staff Systems Architect & Tech Lead',
    badge: 'Tactical STAR Reframing',
    avatar: '👨‍💻',
    style: 'border-teal-500/30 bg-teal-950/60 text-teal-300',
    welcome: "Great job completing the simulation! Let's get tactical. I specialize in turning average answers into quantitative, metric-backed STAR stories and bulletproof system designs. Ask me how to reframe any question you struggled with!",
  },
  {
    id: 'vikram',
    name: 'Coach Vikram',
    title: 'VP of Engineering & Hiring Director',
    badge: 'Hiring Committee Insider',
    avatar: '👔',
    style: 'border-emerald-500/30 bg-emerald-950/60 text-emerald-300',
    welcome: "Namaste! Having hired hundreds of engineers, I can tell you that hiring managers look for tenacity, clarity, and growth mindset. Let's sharpen your pitch so you walk away with the offer!",
  },
];

const QUICK_PROMPTS = [
  'Turn my weakest answer into a Top 1% response',
  'Give me a 30-second pep talk for my upcoming interview',
  'How do I bounce back from a low score?',
  'What would a Google/Amazon interviewer think of this performance?',
];

export default function AiInterviewCoach({ report, targetRole = 'Software Engineer', difficultyLevel = 'Intermediate' }) {
  const [selectedPersona, setSelectedPersona] = useState(COACH_PERSONAS[0]);
  const [messages, setMessages] = useState([
    {
      sender: 'coach',
      text: COACH_PERSONAS[0].welcome,
      quote: 'Action cures fear. Each simulated drill brings you 10x closer to the offer.',
      drill: 'Solve 1 Medium Two-Pointer in DSA Studio',
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
      persona: selectedPersona.id,
      gender: selectedPersona.id === 'maya' ? 'female' : 'male',
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
        message: query,
        coachId: selectedPersona.id,
        targetRole,
        difficultyLevel,
        reportSummary: {
          overallScore: report?.overallScore,
          readiness: report?.readinessLevel,
          weaknesses: report?.weaknesses,
          strengths: report?.strengths,
        },
      });

      const replyText = res?.reply || "Keep pushing forward! Let's conquer the next problem together.";
      const coachMessage = {
        sender: 'coach',
        text: replyText,
        quote: res?.motivationalQuote,
        drill: res?.suggestedDrill,
        time: 'Just now',
      };

      setMessages((prev) => [...prev, coachMessage]);
      speakText(replyText);
    } catch (e) {
      console.warn('Coach communication error:', e);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'coach',
          text: "I'm right here with you! Every mock drill builds real interview resilience.",
          time: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#131823] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl text-left">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <span>24/7 AI Interview Coach & Mentor</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-950/80 text-teal-300 border border-teal-500/30 font-mono">
                Neural Voice AI
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive debriefing, STAR re-structuring, and psychological mindset calibration.
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

      {/* Coach Persona Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {COACH_PERSONAS.map((p) => {
          const isSelected = selectedPersona.id === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setSelectedPersona(p);
                setMessages([
                  {
                    sender: 'coach',
                    text: p.welcome,
                    time: 'Just now',
                  },
                ]);
                speakText(p.welcome);
              }}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                isSelected
                  ? 'border-teal-400 bg-teal-950/60 ring-2 ring-teal-500/30 shadow-lg'
                  : 'border-white/10 bg-[#0D111A] hover:bg-[#171E2D]'
              }`}
            >
              <span className="text-2xl">{p.avatar}</span>
              <div className="min-w-0">
                <p className="font-bold text-xs sm:text-sm text-white truncate">{p.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{p.title}</p>
                <span className={`inline-block text-[9px] font-mono font-semibold mt-1 px-1.5 py-0.2 rounded border ${p.style}`}>
                  {p.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chat Stream */}
      <div className="p-4 rounded-2xl bg-[#0D111A] border border-white/5 space-y-3.5 max-h-[300px] overflow-y-auto shadow-inner text-xs">
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
          placeholder={`Ask ${selectedPersona.name} for actionable advice, STAR reframing, or mindset prep...`}
          className="flex-1 bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputText.trim()}
          className="py-3 px-5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask Coach</span>
        </button>
      </div>
    </div>
  );
}
