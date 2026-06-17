# JobReach AI - Complete Setup Guide

## 🎯 Project Overview

JobReach AI is a full-stack career acceleration platform with:
- **Frontend**: React 18 + Vite + TypeScript (Port 5173)
- **Backend**: Node.js/Express server (Port 5000)
- **Features**: Resume builder, ATS checker, Cover letter generator, Interview prep, JD matcher

---

## 📋 Prerequisites

- **Node.js** v16+ and npm
- **Anthropic API Key** (free tier available at https://console.anthropic.com)
- A code editor (VS Code recommended)

---

## 🚀 Frontend Setup

### 1. Install Dependencies
```bash
# In project root
npm install
```

### 2. Create `.env` File
```bash
cp .env.example .env
```

### 3. Add Your API Key
Edit `.env`:
```
VITE_ANTHROPIC_API_KEY=your_actual_api_key_here
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start Development Server
```bash
npm run dev
```
Frontend runs at: http://localhost:5173

---

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Create `.env` File (Backend)
```bash
# backend/.env
PORT=5000
NODE_ENV=development
```

### 4. Start Backend Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```
Backend runs at: http://localhost:5000

---

## 📁 Project Structure

```
job-reach-ai/
├── src/
│   ├── pages/
│   │   ├── Home.tsx           # Landing page (updated with centered hero)
│   │   ├── Auth.tsx           # Sign In/Sign Up page
│   │   ├── ResumeBuilder.tsx
│   │   ├── CoverLetter.tsx
│   │   ├── ATSChecker.tsx
│   │   ├── JDMatcher.tsx
│   │   ├── InterviewPrep.tsx
│   │   └── SavedOutputs.tsx
│   ├── components/
│   │   ├── Navbar.tsx         # Updated with CV Maker AI link
│   │   ├── ResumeUpload.tsx   # NEW - Resume file upload
│   │   ├── GalaxyBackground.tsx
│   │   ├── FloatingObjects.tsx
│   │   ├── Toast.tsx
│   │   ├── MarkdownOutput.tsx
│   │   └── ScoreRing.tsx
│   ├── api/
│   │   ├── claude.ts          # Claude API integration
│   │   └── resumeApi.ts       # NEW - Resume upload API
│   ├── context/
│   │   └── AppContext.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── backend/
│   ├── server.js              # NEW - Express server
│   ├── package.json           # NEW - Backend dependencies
│   ├── uploads/               # Resume storage (auto-created)
│   └── files-db.json          # File registry (auto-created)
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🎨 What's New & Updated

### ✅ Homepage (Updated)
- **Centered hero heading**: "Land Your Dream Job with AI"
- **Proper spacing** between all sections
- **Contact section** with your contact info:
  - Email: aishwaryasai@gmail.com
  - LinkedIn: linkedin.com/in/ayinam-aishvarya-s-5b9a86292
  - GitHub: github.com/saiaishusaiii-alt

### ✅ Navigation (Updated)
- Added **"CV Maker AI"** link (points to /resume)
- Added **"Sign In"** link (points to /auth)
- Full mobile-responsive menu

### ✅ Authentication (New)
- Sign In/Sign Up page at `/auth`
- Form validation (email, password, matching passwords)
- Local storage for demo (beginner-friendly)
- Show toast notifications on success

### ✅ Resume Upload (New)
- Drag-and-drop file upload component
- Support for PDF, DOC, DOCX files
- 5MB file size limit
- Backend file storage and management

### ✅ Backend Server (New)
- Express.js server on port 5000
- Resume upload endpoint: `POST /api/resume/upload`
- List resumes endpoint: `GET /api/resume/list`
- Delete resume endpoint: `DELETE /api/resume/:filename`
- File validation and error handling
- CORS enabled for frontend communication

---

## 🔌 API Endpoints

### Resume Upload
```
POST /api/resume/upload
Content-Type: multipart/form-data
Body: { resume: File }
Response: { success: true, file: {...} }
```

### Get Uploaded Resumes
```
GET /api/resume/list
Response: { success: true, count: N, files: [...] }
```

### Delete Resume
```
DELETE /api/resume/:filename
Response: { success: true, message: "..." }
```

### Health Check
```
GET /api/health
Response: { status: "JobReach Backend is running!", timestamp: "..." }
```

---

## 🛠️ Running Both Frontend & Backend

### Option 1: Two Terminal Windows
**Terminal 1 - Frontend:**
```bash
cd job-reach-ai
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd job-reach-ai/backend
npm start
```

### Option 2: Concurrently (Install globally first)
```bash
npm install -g concurrently

# Run from project root with both servers
concurrently "npm run dev" "cd backend && npm start"
```

---

## 📝 Features You Can Use Now

### 1. **Homepage**
- Visit http://localhost:5173
- See centered hero with proper spacing
- Click "Start Building Resume" to go to builder

### 2. **Authentication**
- Visit http://localhost:5173/auth
- Sign up or sign in
- Data stored in browser (demo mode)

### 3. **Resume Upload**
- In Resume Builder, drag-drop or click to upload
- Supports PDF, DOC, DOCX
- Backend stores files in `backend/uploads/`

### 4. **Resume Templates**
- Add your own resume template images to `public/templates/`
- Reference them in ResumeBuilder component

---

## 🎓 Beginner-Friendly Backend Explanation

The backend uses:
- **Express.js** - Simple HTTP server framework
- **Multer** - File upload handling
- **JSON File Storage** - Easy-to-understand file registry (no database)
- **CORS** - Allows frontend to communicate

**How it works:**
1. Frontend sends file via multipart form
2. Backend validates (type, size)
3. Server saves file to `uploads/` folder
4. File info stored in `files-db.json`
5. Frontend notified of success

---

## 🔒 Environment Variables

### Frontend (.env)
```
VITE_ANTHROPIC_API_KEY=your_api_key
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)
```
PORT=5000
NODE_ENV=development
```

---

## 🐛 Troubleshooting

### "Backend not connected"
- Ensure backend is running: `npm start` in `backend/` folder
- Check port 5000 is available
- Verify `REACT_APP_API_URL` in frontend .env

### "File upload fails"
- Check file is PDF, DOC, or DOCX
- Verify file size < 5MB
- Ensure `backend/uploads/` folder exists
- Check backend console for errors

### "API key error"
- Verify key in `.env` is correct
- Make sure `.env` file exists in project root
- Restart dev server after changing .env

### Frontend won't start
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version: `node --version` (should be v16+)

---

## 📚 Next Steps

1. **Add Resume Template Images**
   - Create `public/templates/` folder
   - Add resume template screenshots
   - Display them in ResumeBuilder

2. **Integrate Database**
   - Replace `files-db.json` with MongoDB/PostgreSQL
   - Add user authentication with JWT

3. **Deploy**
   - Frontend: Vercel, Netlify, GitHub Pages
   - Backend: Heroku, Railway, Render

4. **Add More Features**
   - Resume parsing with AI
   - Email integration
   - Job application tracking

---

## 📞 Support

- **Issues**: Check GitHub repository
- **Questions**: Review code comments
- **Contact**: aishwaryasai@gmail.com

---

**Made with ❤️ for your career success!**
