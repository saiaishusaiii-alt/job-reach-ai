# Quick Setup Guide

## Prerequisites
- Node.js 16+
- npm or pnpm
- Anthropic API key (get it at https://console.anthropic.com)

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/Aishvaryasai05/jobreach-ai.git
cd jobreach-ai
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:
```
VITE_ANTHROPIC_API_KEY=your_actual_api_key_here
```

### 4. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
```

Output files will be in the `dist/` folder.

## Getting Your API Key

1. Visit https://console.anthropic.com
2. Sign up or log in
3. Create a new API key
4. Add it to your `.env` file as `VITE_ANTHROPIC_API_KEY`

## Project Structure

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Main routing
├── index.css             # Global styles
├── api/
│   └── claude.ts         # Claude API client
├── context/
│   └── AppContext.tsx    # Global state (saved outputs, toasts)
├── components/
│   ├── GalaxyBackground.tsx    # Animated canvas background
│   ├── FloatingObjects.tsx     # Floating decorative elements
│   ├── Navbar.tsx              # Navigation
│   ├── Toast.tsx               # Notifications
│   ├── MarkdownOutput.tsx      # Markdown renderer
│   ├── ScoreRing.tsx           # Circular progress ring
│   └── FileInput.tsx           # File upload component
└── pages/
    ├── Home.tsx                # Landing page
    ├── ResumeBuilder.tsx       # Resume generation
    ├── CoverLetter.tsx         # Cover letter generation
    ├── ATSChecker.tsx          # ATS compatibility checker
    ├── JDMatcher.tsx           # Job description matcher
    ├── InterviewPrep.tsx       # Interview question generator
    └── SavedOutputs.tsx        # Saved outputs library
```

## Available Routes

- `/` - Home page
- `/resume` - Resume Builder
- `/coverletter` - Cover Letter Generator
- `/ats` - ATS Compatibility Checker
- `/jdmatch` - Job Description Matcher
- `/interview` - Interview Question Generator
- `/saved` - Saved Outputs Library

## Features

### 1. Resume Builder
- Step-by-step wizard or paste & optimize mode
- Collects personal info, experience, projects, education, skills
- AI generates professional, ATS-ready resume
- Copy, download as Markdown, or save to library

### 2. Cover Letter Generator
- Input: resume, company, role, job description
- AI generates tailored cover letter
- 3 tone options: Professional, Enthusiastic, Concise
- Download or save

### 3. ATS Compatibility Checker
- Upload/paste resume
- Get ATS score (0-100) with detailed breakdown
- See matched and missing keywords
- Get actionable improvement tips
- Section-by-section analysis

### 4. Job Description Matcher
- Compare resume against job description
- Match score with visual ring
- Strong matches, gaps, partial matches
- Specific resume edit suggestions
- Skills to learn recommendations

### 5. Interview Question Generator
- Generate role-specific questions
- Multiple question types: Technical, Behavioral, Project-based, Situational
- Difficulty levels: Fresher, Intermediate, Senior
- Expandable hints and answer frameworks
- Download as printable PDF

### 6. Saved Outputs
- All content automatically saved to localStorage
- Filter by type and sort by date
- Copy, download, or delete
- Persistent across sessions

## Technology Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + Custom CSS for glassmorphism
- **Animation:** Framer Motion
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Markdown:** marked library
- **State:** React Context + localStorage

## Customization

### Change API Model
Edit `src/api/claude.ts` and change the `model` parameter in the fetch request.

### Modify Colors
Edit `src/index.css` CSS variables at the top:
```css
:root {
  --accent-violet: #7c3aed;
  --accent-cyan: #06b6d4;
  /* ... other colors */
}
```

### Adjust Tailwind Theme
Edit `tailwind.config.js` to customize colors, fonts, and animations.

## Troubleshooting

### "API key not found"
- Make sure `.env` file exists in root directory
- Verify `VITE_ANTHROPIC_API_KEY` is set correctly
- Restart dev server after updating `.env`

### Claude API errors
- Check that your API key is valid and has credits
- Verify network connectivity
- Check browser console for detailed error messages

### localStorage not working
- Ensure localStorage is enabled in browser settings
- Not available in private/incognito mode
- Clear browser cache and try again

## Contributing

This is an open-source project! Feel free to:
- Fork the repository
- Create feature branches
- Submit pull requests
- Open issues for bugs or feature requests

## License

MIT License - see LICENSE file for details

## Support

- 📖 Read the README.md for full documentation
- 🐛 Report bugs in GitHub Issues
- 💡 Suggest features in GitHub Discussions
- 🤝 Contribute code via Pull Requests

## Deployment

### Deploy to Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
1. Push to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable `VITE_ANTHROPIC_API_KEY`

### Deploy to GitHub Pages
```bash
npm run build
npm run preview
```

---

**Made with ❤️ for job seekers and career changers**
