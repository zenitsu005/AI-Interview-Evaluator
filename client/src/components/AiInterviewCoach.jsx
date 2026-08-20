import React, { useState, useEffect, useRef } from 'react';
import { sendCoachMessage } from '../services/api';

const COACH_PERSONAS = [
  {
    id: 'maya',
    name: 'Coach Maya',
    title: 'Principal FAANG Interview Mentor',
    badge: '🌟 Empathetic & Energizing',
    avatar: '👩‍🏫',
    style: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
    welcome: "Hey there! I looked at your interview breakdown. Remember: every single top engineer has had rough interview simulations. What matters isn't where you start—it's how fast you calibrate. I'm here 24/7 to turn your gaps into your biggest strengths. How are you feeling about the session?",
  },
  {
    id: 'alex',
    name: 'Coach Alex',
    title: 'Staff Systems Architect & Tech Lead',
    badge: '🎯 Tactical STAR Reframing',
    avatar: '👨‍💻',
    style: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300',
    welcome: "Great job completing the simulation! Let's get tactical. I specialize in turning average answers into quantitative, metric-backed STAR stories and bulletproof system designs. Ask me how to reframe any question you struggled with!",
  },
  {
    id: 'vikram',
    name: 'Coach Vikram',
    title: 'VP of Engineering & Hiring Director',
    badge: '💼 Indian Market & FAANG Insider',
    avatar: '👔',
    style: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300',
    welcome: "Namaste! Having hired hundreds of engineers across Bangalore, Hyderabad, and Silicon Valley, I can tell you that hiring managers look for tenacity, clarity, and growth mindset. Let's sharpen your pitch so you walk away with the offer!",
  },
];

const QUICK_PROMPTS = [
  '🔥 How do I bounce back from a low score?',
  '⭐ Turn my weakest answer into a Top 1% response',
  '🎙️ Give me a 30-second pep talk for my upcoming interview',
  '💼 What would a Google/Amazon interviewer think of this performance?',
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
    if (!isVoiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const clean = (text || '').replace(/[*#`_]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = selectedPersona.id === 'maya' ? 1.05 : 0.95;

    const voices = window.speechSynthesis.getVoices() || [];
    const preferred =
      selectedPersona.id === 'maya'
        ? voices.find((v) => /samantha|zira|female|victoria|google/i.test(v.name)) || voices[0]
        : voices.find((v) => /david|george|male|daniel|mark/i.test(v.name)) || voices[0];
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSwitchPersona = (p) => {
    setSelectedPersona(p);
    setMessages([
      {
        sender: 'coach',
        text: p.welcome,
        quote: 'Continuous iteration is the differentiator of top 1% engineering talent.',
        drill: 'Review 7-Day Roadmap Day 1 Focus',
        time: 'Just now',
      },
    ]);
    if (isVoiceEnabled) speakText(p.welcome);
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const interviewContext = {
        targetRole,
        difficultyLevel,
        overallScore: report?.overallScore || 0,
        readinessLevel: report?.readinessLevel || 'In Progress',
        strengths: report?.strengths || [],
        weaknesses: report?.weaknesses || [],
      };

      const res = await sendCoachMessage({
        coachPersona: selectedPersona,
        candidateMessage: text,
        interviewContext,
      });

      if (res && res.coachResponse) {
        const coachMsg = {
          sender: 'coach',
          text: res.coachResponse,
          quote: res.encouragementQuote,
          drill: res.recommendedDrill,
          actionItem: res.actionItem,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, coachMsg]);
        speakText(res.coachResponse);
      }
    } catch (e) {
      console.warn('AI Coach chat notice:', e);
      const fallbackMsg = {
        sender: 'coach',
        text: "You showed great courage in attempting this full assessment! Remember: an interview score is simply a snapshot of this moment, not your ceiling. Pick one gap from your 7-Day roadmap today and practice it for 20 minutes. You have everything it takes to crack your dream role!",
        quote: 'Fall seven times, stand up eight. Success in tech interviews is 90% repetition.',
        drill: 'Review DSA Practice Studio',
        time: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      speakText(fallbackMsg.text);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-dark border-indigo-500/50 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-5 sm:p-6 space-y-5 shadow-2xl rounded-2xl border-2 ring-4 ring-indigo-500/10">
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg animate-pulse">
            {selectedPersona.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-white">{selectedPersona.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/40 bg-indigo-950/60 text-indigo-300">
                {selectedPersona.title}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Personalized 24/7 AI Interview Motivation & Tactical Re-framing Coach
            </p>
          </div>
        </div>

        {/* Voice Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (isSpeaking) window.speechSynthesis?.cancel();
              setIsVoiceEnabled(!isVoiceEnabled);
            }}
            className={`text-xs px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-all ${
              isVoiceEnabled
                ? 'border-indigo-500 bg-indigo-950/80 text-indigo-300'
                : 'border-slate-800 bg-slate-950 text-slate-500'
            }`}
          >
            <span>{isVoiceEnabled ? '🔊 Voice Spoken (ON)' : '🔇 Voice Muted'}</span>
          </button>
        </div>
      </div>

      {/* ── Coach Persona Selection Pills ── */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Choose Your AI Coach:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {COACH_PERSONAS.map((p) => {
            const isSel = selectedPersona.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSwitchPersona(p)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 ${
                  isSel
                    ? 'border-indigo-500 bg-indigo-950/60 ring-2 ring-indigo-500/30 text-white shadow-md'
                    : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="text-lg">{p.avatar}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{p.badge}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Chat Stream Box ── */}
      <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 space-y-3.5 max-h-[360px] overflow-y-auto shadow-inner">
        {messages.map((m, idx) => {
          const isCoach = m.sender === 'coach';
          return (
            <div
              key={idx}
              className={`flex flex-col space-y-1 text-xs animate-fade-in ${
                isCoach ? 'items-start' : 'items-end'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                <span>{isCoach ? selectedPersona.name : 'You'}</span>
                <span>•</span>
                <span>{m.time}</span>
              </div>

              <div
                className={`p-3.5 rounded-2xl max-w-[90%] sm:max-w-[80%] leading-relaxed ${
                  isCoach
                    ? 'bg-slate-900 border border-slate-800 text-slate-200 shadow-md'
                    : 'bg-indigo-600 text-white font-medium shadow-md'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>

                {m.quote && (
                  <div className="mt-2.5 p-2 bg-slate-950/80 rounded-xl border border-amber-500/30 text-amber-300 text-[11px] font-medium flex items-center gap-1.5">
                    <span>⚡</span>
                    <span><em>"{m.quote}"</em></span>
                  </div>
                )}

                {m.drill && (
                  <div className="mt-2 text-[10px] text-cyan-300 font-mono flex items-center gap-1">
                    <span>🎯 Recommended Drill:</span>
                    <strong>{m.drill}</strong>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 animate-pulse p-2">
            <span className="text-base">{selectedPersona.avatar}</span>
            <span>{selectedPersona.name} is crafting your motivational coaching advice...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ── Quick Tap Motivational Prompts ── */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          ⚡ 1-Click Motivation Boosters:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(qp)}
              disabled={isLoading}
              className="text-[11px] bg-slate-950 hover:bg-slate-900 text-indigo-300 hover:text-white border border-slate-800 hover:border-indigo-500/60 px-3 py-1.5 rounded-xl transition-all shadow-sm"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input Bar ── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 pt-1"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask ${selectedPersona.name} for advice, STAR reframing, or a pep talk...`}
          disabled={isLoading}
          className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="btn-primary py-2.5 px-5 text-xs font-bold shadow-md btn-glow flex items-center gap-1.5 disabled:opacity-50"
        >
          <span>💬</span>
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
