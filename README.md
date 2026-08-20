# 🎯 AI Mock Interview & Evaluation System

An AI-powered mock interview platform that works with **any resume** and **any job role**.

## Features

- 📄 **Resume Input**: Paste text or upload PDF/DOCX
- 🧠 **3 Interview Rounds**: Aptitude → Technical → HR
- 🤖 **AI-Powered**: Google Gemini generates questions tailored to your profile
- 📊 **Detailed Report**: Scores, strengths, gaps, and actionable suggestions

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| AI Engine | Google Gemini API |
| File Parsing | pdf-parse + mammoth |

## Quick Start

### 1. Get a Gemini API Key
Visit https://aistudio.google.com/ and create a free API key.

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

### 4. Open the App
Navigate to http://localhost:5173

## Project Structure

```
mock-interview-app/
├── client/          # React frontend (Vite)
└── server/          # Express backend
```

## Interview Rounds

| Round | Questions | Type |
|---|---|---|
| 🧠 Aptitude | 2 | Logical & Numerical |
| 💻 Technical | 3 | Fundamentals → Advanced |
| 🤝 HR | 2 | Behavioral & Situational |

## Performance Report Includes

- Round-wise scores (Aptitude, Technical, HR)
- Overall score /100
- Readiness level (Not Ready → Excellent)
- Identified strengths
- Knowledge gaps
- Actionable improvement suggestions
- Full interview transcript
