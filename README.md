# 🎯 InterviewAI — Multimodal AI Mock Interview & Evaluation Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-interview-evaluator-theta.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Gemini%20%7C%20Tailwind-0ea5e9?style=for-the-badge)](https://ai-interview-evaluator-theta.vercel.app)
[![Academic Literature](<https://img.shields.io/badge/Research-Scopus%20Indexed%20(IEEE%20%2F%20ACM)-0d9488?style=for-the-badge>)](./Literature_Survey_Table.md)

An end-to-end, production-grade **Multimodal AI Mock Interview Platform** that bridges the gap between technical problem-solving and non-verbal behavioral coaching. Featuring **real-time client-side Edge AI telemetry**, an **interactive lip-synced AI Interviewer Avatar**, **live DSA code execution**, and **adaptive two-way cross-examination probes**.

---

## 🚀 Key Features & Innovations

### 1. 🤖 Interactive AI Interviewer Avatar & Dual-Meeting Layout

- **Dual-Feed Experience:** Recreates real-world Zoom/Google Meet interviews with the candidate's webcam feed sitting across from a lip-synced digital interviewer avatar (`AiInterviewerAvatar.jsx`).
- **Dynamic Speech Synthesis:** Adjustable speech rate (0.8x to 1.5x) with replay controls and visual audio-wave indicators during active speech.
- **Accessible Virtual Candidate Mode:** Intelligent fallback for low bandwidth or disabled cameras that isolates acoustic steadiness without penalizing candidates.

### 2. ⚡ Real-Time Client-Side "Edge AI" Telemetry HUD

- **Visual Composure (CV):** Computes frame differencing via HTML5 Canvas math directly on the browser CPU at 400ms intervals to track head motion, posture shifts, and physical composure.
- **Vocal Steadiness (Acoustics):** Uses the native `Web Audio API` (`AnalyserNode`) to analyze volume variance, pause cadence, and Words-Per-Minute (WPM).
- **Instant "In-Flight" Filler Flash:** Real-time regex pattern matching displays instant alerts (`"Filler Word Detected ('basically') — Pause & Breathe"`) to train neurological muscle memory during speech.
- **Zero Server GPU Cost & 100% Privacy:** All video and audio frame calculations run strictly on the client side—no video streams are uploaded to cloud servers.

### 3. 🎯 Two-Way Adaptive Cross-Examination Probing

- **Not a Passive Form-Filler:** The AI interviewer listens to your answer, identifies vague claims, missing edge cases, or logical gaps, and triggers autonomous follow-up probes (`handleRequestProbe`).
- **Realistic In-Session Hints:** Request hints during challenging technical rounds with realistic scoring penalties.

### 4. 🛠️ Targeted Practice Studios

- **Full Mock Interview Studio:** Complete multi-round hiring simulation (Aptitude & Logic → Technical Depth → Behavioral HR with STAR rubric).
- **Live DSA Practice Studio:** In-browser multi-language compiler (C++, Python, Java, C) with custom input, instant execution, and automated test case validation.
- **Bug Hunter Studio:** Real-time code debugging laboratory testing candidate ability to spot concurrency deadlocks, memory leaks, and off-by-one errors.
- **60s Rapid Blitz:** High-pressure spontaneous clarity drills for impromptu technical explanations.
- **ATS Resume Scorer & Salary Negotiator:** Resume optimization feedback and counter-offer roleplay.

---

## 🏛️ System Architecture

```
                               ┌──────────────────────────────────────────────┐
                               │             CANDIDATE BROWSER                │
                               │        (React 18 + Vite + Tailwind)          │
                               └───────┬──────────────────────────────┬───────┘
                                       │                              │
                    Live Webcam Video  │                              │ Live Mic Audio
                                       ▼                              ▼
                 ┌──────────────────────────────┐      ┌──────────────────────────────┐
                 │    HTML5 Canvas Video CV     │      │     Web Audio API Analyser   │
                 │   Frame Differencing Engine  │      │     FFT Amplitude Variance   │
                 └──────────────┬───────────────┘      └──────────────┬───────────────┘
                                │                                     │
                                └───────────────┬─────────────────────┘
                                                ▼
                               ┌─────────────────────────────────┐
                               │     Client-Side Telemetry HUD   │
                               │   • Composure: XX%              │
                               │   • Vocal Steadiness: XX%       │
                               │   • Filler-Word Flash Alert     │
                               └────────────────┬────────────────┘
                                                │
                                    Spoken Text Transcript
                                                │
                                                ▼
                               ┌─────────────────────────────────┐
                               │       Node.js / Express API     │
                               └────────────────┬────────────────┘
                                                │
                                                ▼
                               ┌─────────────────────────────────┐
                               │        Google Gemini API        │
                               │   • STAR Rubric Evaluation      │
                               │   • Cross-Examination Probing   │
                               │   • Code Correctness & Feedback │
                               └─────────────────────────────────┘
```

---

## 📚 Academic Literature & Research Foundation

This project was engineered to solve fundamental gaps identified in recent **2024–2026 Scopus-Indexed IEEE and ACM publications**:

| Paper & Venue                                                                                            |   Year   | Technology                                        | Gap Addressed by InterviewAI                                                                                                 |
| -------------------------------------------------------------------------------------------------------- | :------: | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **AI-Powered MetaHuman Interviewer**<br>_(IEEE Access — Scopus Q1)_                                      | **2025** | MetaHuman 3D Avatar, Speech STT/TTS, LLMs         | Eliminates heavy 3D Unreal game engines with a **zero-install, in-browser lip-synced avatar and live telemetry HUD**.        |
| **MAG-BERT-ARL for Fair Video Interview Assessment**<br>_(IEEE Access — Scopus Q1)_                      | **2024** | Multimodal Adaptation Gate (MAG-BERT), OpenFace   | Transforms passive, one-way recruiter screening filters into a **candidate-centric practice studio with adaptive probing**.  |
| **Prompting-in-a-Series: Personality Recognition**<br>_(IEEE Trans. Comput. Social Systems — Scopus Q1)_ | **2026** | Decoder-Only LLMs, PICEPR Prompt Series           | Bridges text-only transcript scoring with **real-time tri-modal fusion** (Computer Vision + Audio FFT + LLM).                |
| **Efficient Job Interview Video Processing**<br>_(ACM ICMI — Scopus Indexed)_                            | **2024** | Differentiable Masking, Audio-Visual Transformers | Replaces server-side batch video evaluation with **client-side Edge AI** and adds **specialized DSA & Bug Hunting studios**. |
| **Automated Interview Evaluation System**<br>_(IEEE Conference Series — Scopus Indexed)_                 | **2024** | RoBERTa Transformer, Cosine Similarity            | Expands rigid keyword matching into **STAR-guided feedback, ideal model answers, and delivery coaching**.                    |

_Full literature survey, feature matrix, and download links are available in [Literature_Survey_Table.md](./Literature_Survey_Table.md)._

---

## 💻 Tech Stack

| Layer                   | Technologies                                                                   |
| ----------------------- | ------------------------------------------------------------------------------ |
| **Frontend**            | React 18, Vite, Tailwind CSS, Lucide React, Tabler Icons                       |
| **Edge AI & Telemetry** | HTML5 Canvas (Computer Vision), Web Audio API (`AnalyserNode`), Web Speech API |
| **Backend & APIs**      | Node.js, Express.js, RESTful Architecture                                      |
| **AI Reasoning Engine** | Google Gemini API (Gemini 1.5 / 2.0 Flash)                                     |
| **Document Parsing**    | `pdf-parse`, `mammoth` (DOCX extraction)                                       |
| **Deployment**          | Vercel (Frontend & Serverless Integration)                                     |

---

## 🛠️ Quick Start Guide

### Prerequisites

- Node.js (v18+ recommended)
- Free Google Gemini API Key ([Get one at Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/AI-Interview-Evaluator.git
cd AI-Interview-Evaluator
```

### 2. Configure Environment Variables

Inside the `server/` directory, create a `.env` file:

```env
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 3. Install Dependencies & Start Development Server

```bash
# Start Backend
cd server
npm install
npm run dev

# In a separate terminal, start Frontend
cd client
npm install
npm run dev
```

### 4. Open in Browser

Navigate to `http://localhost:5173` to start practicing.

---

## 📊 Evaluation Metrics Reported

- **Round-Wise Competency:** Numerical and qualitative scores across Aptitude, Technical, and HR rounds.
- **STAR Methodology Breakdown:** Situation, Task, Action, and Result completeness.
- **Non-Verbal Delivery Metrics:** Average physical composure percentage, vocal steadiness, speech rate (WPM), and filler-word frequency breakdown.
- **Constructive Coaching:** Identified strengths, specific knowledge gaps, and an AI-generated ideal model answer for every question.
