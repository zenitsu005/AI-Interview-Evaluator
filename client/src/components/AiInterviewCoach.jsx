import React, { useState, useEffect, useRef } from 'react';
import { sendCoachMessage } from '../services/api';

const COACH_PERSONAS = [
  {
    id: 'maya',
    name: 'Coach Maya',
    title: 'Principal FAANG Interview Mentor',
    badge: '🌟 Empathetic & Energizing',
    avatar: '👩‍🏫',
    style: 'border-amber-200 bg-amber-50 text-amber-900',
    welcome: "Hey there! I looked at your interview breakdown. Remember: every single top engineer has had rough interview simulations. What matters isn't where you start—it's how fast you calibrate. I'm here 24/7 to turn your gaps into your biggest strengths. How are you feeling about the session?",
  },
  {
    id: 'alex',
    name: 'Coach Alex',
    title: 'Staff Systems Architect & Tech Lead',
    badge: '🎯 Tactical STAR Reframing',
    avatar: '👨‍💻',
    style: 'border-teal-200 bg-teal-50 text-teal-900',
    welcome: "Great job completing the simulation! Let's get tactical. I specialize in turning average answers into quantitative, metric-backed STAR stories and bulletproof system designs. Ask me how to reframe any question you struggled with!",
  },
  {
    id: 'vikram',
    name: 'Coach Vikram',
    title: 'VP of Engineering & Hiring Director',
    badge: '💼 Indian Market & FAANG Insider',
    avatar: '👔',
    style: 'border-emerald-200 bg-emerald-50 text-emerald-900',
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

  const handleSendMessage = async (customPrompt = null) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isLoading) return;

    const newMsgList = [...messages, { sender: 'user', text: textToSend, time: 'Just now' }];
    setMessages(newMsgList);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await sendCoachMessage({
        coachId: selectedPersona.id,
        targetRole,
        difficultyLevel,
        reportSummary: {
          overallScore: report?.overallScore,
          readinessLevel: report?.readinessLevel,
          weaknesses: report?.weaknesses,
          strengths: report?.strengths,
        },
        conversation: newMsgList.map((m) => ({
          role: m.sender === 'coach' ? 'assistant' : 'user',
          content: m.text,
        })),
        userMessage: textToSend,
      });

      const coachResponse = res?.reply || "You've got this! Keep practicing and each simulation will boost your confidence.";
      setMessages((prev) => [
        ...prev,
        {
          sender: 'coach',
          text: coachResponse,
          quote: res?.motivationalQuote || null,
          drill: res?.suggestedDrill || null,
          time: 'Just now',
        },
      ]);
      if (isVoiceEnabled) speakText(coachResponse);
    } catch (err) {
      console.warn('Coach response fallback:', err);
      const fallbackReply = `That is a crucial insight for your ${targetRole} prep. Focus on structuring each technical explanation with clear trade-offs, and state your quantitative impact upfront.`;
      setMessages((prev) => [
        ...prev,
        {
          sender: 'coach',
          text: fallbackReply,
          time: 'Just now',
        },
      ]);
      if (isVoiceEnabled) speakText(fallbackReply);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 text-left">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700">
            🤖 24/7 AI Interview Coach & Motivator
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Debrief & Strategy Coaching
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsVoiceEnabled(!isVoiceEnabled);
              if (isSpeaking) window.speechSynthesis?.cancel();
            }}
            className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer shadow-xs ${
              isVoiceEnabled
                ? 'bg-teal-50 text-teal-800 border-teal-200'
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <span>{isVoiceEnabled ? '🔊 Voice On' : '🔇 Voice Muted'}</span>
          </button>
        </div>
      </div>

      {/* Coach Persona Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {COACH_PERSONAS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSwitchPersona(p)}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedPersona.id === p.id
                ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-sm'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{p.avatar}</span>
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">{p.name}</p>
                <p className="text-[11px] text-slate-500">{p.badge}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 h-72 overflow-y-auto space-y-3.5 shadow-inner">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[10px] text-slate-500 mb-1 px-1 font-sans">
              {m.sender === 'user' ? 'You' : selectedPersona.name}
            </span>
            <div
              className={`p-3.5 rounded-2xl max-w-lg text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-teal-600 text-white rounded-br-none shadow-sm'
                  : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none shadow-sm'
              }`}
            >
              <p>{m.text}</p>
              {m.quote && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-amber-800 italic">
                  💬 "{m.quote}"
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <svg className="animate-spin h-3.5 w-3.5 text-teal-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>{selectedPersona.name} is thinking...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition-all shadow-xs cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask ${selectedPersona.name} about your interview answers or strategy...`}
          className="flex-1 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none shadow-sm"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="py-3 px-5 text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-md cursor-pointer disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
