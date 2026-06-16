# JobReach AI — Career Acceleration Platform

A fully functional AI-powered career platform built with React, Vite, and Anthropic Claude API. 5 intelligent tools that build resumes, write cover letters, optimize for ATS, match job descriptions, and prepare you for interviews.

## Features

- 🎨 **Dark Galaxy Glassmorphism Design** — Beautiful UI with animated backgrounds
- 📄 **Resume Builder** — AI-powered resume generator with step-by-step wizard
- 📝 **Cover Letter Generator** — Tailored letters based on resume + job description
- 🔍 **ATS Compatibility Checker** — Score your resume and get improvement tips
- 🎯 **JD Matcher** — See exactly how your resume matches a job posting
- 🎤 **Interview Prep** — Get role-specific interview questions
- 💾 **Saved Outputs** — All your AI-generated content saved locally

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + Glassmorphism
- **Animation:** Framer Motion
- **AI:** Anthropic Claude API
- **Routing:** React Router v6
- **Icons:** Lucide React
- **State:** React Context + localStorage

## Getting Started

### Prerequisites
- Node.js 16+ and npm/pnpm
- Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/jobreach-ai.git
cd jobreach-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your Anthropic API key to `.env`:
```
VITE_ANTHROPIC_API_KEY=your_key_here
```

5. Start development server:
```bash
npm run dev
```

6. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── main.tsx              # App entry
├── App.tsx               # Main routing
├── index.css             # Global styles
├── api/
│   └── claude.ts         # Claude API client
├── context/
│   └── AppContext.tsx    # Global state (saved outputs, toasts)
├── components/
│   ├── GalaxyBackground.tsx   # Canvas background
│   ├── FloatingObjects.tsx    # Floating animated elements
│   ├── Navbar.tsx             # Navigation bar
│   ├── Toast.tsx              # Toast notifications
│   ├── MarkdownOutput.tsx     # Markdown renderer
│   ├── ScoreRing.tsx          # Circular progress ring
│   └── FileInput.tsx          # File upload component
└── pages/
    ├── Home.tsx
    ├── ResumeBuilder.tsx
    ├─��� CoverLetter.tsx
    ├── ATSChecker.tsx
    ├── JDMatcher.tsx
    ├── InterviewPrep.tsx
    └── SavedOutputs.tsx
```

## Available Routes

- `/` — Home page with tool overview
- `/resume` — Resume builder with wizard
- `/coverletter` — Cover letter generator
- `/ats` — ATS compatibility checker
- `/jdmatch` — Job description matcher
- `/interview` — Interview question generator
- `/saved` — Saved outputs library

## Features in Detail

### Resume Builder
- Step-by-step wizard or paste & optimize mode
- Collects: personal info, work experience, projects, education, skills, certifications
- AI generates professional, ATS-ready resume
- Copy, download, or save to library

### Cover Letter Generator
- Input: your resume, company name, job role, job description
- AI generates tailored cover letter
- Tone selection: Professional, Enthusiastic, or Concise
- Download or save

### ATS Checker
- Upload/paste your resume
- Optional: paste job description for better analysis
- Outputs: ATS score (0-100), matched keywords, missing keywords, improvement tips
- Formatted with visual score ring and color-coded badges

### JD Matcher
- Compare resume against job description
- Shows: match score, strong matches, missing skills, gaps, rephrase suggestions
- Helps identify exactly what to add to your resume

### Interview Prep
- Input: resume, target role, company, interview round, question types, difficulty level
- Generates role-specific questions with answer hints
- Supports: technical, behavioral, project-based, situational questions
- Export as printable document

### Saved Outputs
- All generated content automatically saved to localStorage
- Filter by type and sort by date
- Quick access to all your AI-generated career materials

## Design System

### Colors
```
Base Background: #04050f
Glass Card: rgba(255, 255, 255, 0.04)
Primary Accent: #7c3aed (Violet)
Secondary Accent: #06b6d4 (Cyan)
Success: #10b981
Error: #ef4444
Warning: #f59e0b
```

### Typography
- UI: Inter
- Code: JetBrains Mono

## API Keys & Security

⚠️ **Important:** This app runs entirely in the browser and sends API requests directly to Anthropic's Claude API. Your API key should be in the `.env` file (not committed to git).

For production deployment, consider:
1. Using a backend proxy to hide API keys
2. Implementing user authentication
3. Rate limiting on the backend

## Troubleshooting

### "API key not found"
- Make sure `.env` file exists in the root directory
- Verify `VITE_ANTHROPIC_API_KEY` is set correctly
- Restart the dev server after updating `.env`

### Claude API errors
- Check that your API key is valid and has active credits
- Verify network connectivity
- Check browser console for detailed error messages

### localStorage not working
- Ensure localStorage is enabled in browser settings
- Check that you're not in private/incognito mode
- Clear browser cache and try again

## Contributing

Feel free to open issues and submit pull requests!

## License

MIT License — feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check the GitHub issues
2. Review the troubleshooting section above
3. Open a new issue with details

---

**Made with ❤️ for aspiring tech professionals**
