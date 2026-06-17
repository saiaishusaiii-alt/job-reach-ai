import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import GalaxyBackground from './components/GalaxyBackground';
import FloatingObjects from './components/FloatingObjects';
import Navbar from './components/Navbar';
import Toast from './components/Toast';

// Pages
import Home from './pages/Home';
import ResumeBuilder from './pages/ResumeBuilder';
import CoverLetter from './pages/CoverLetter';
import ATSChecker from './pages/ATSChecker';
import JDMatcher from './pages/JDMatcher';
import InterviewPrep from './pages/InterviewPrep';
import SavedOutputs from './pages/SavedOutputs';
import Auth from './pages/Auth';

function AppContent() {
  const location = useLocation();

  return (
    <>
      <GalaxyBackground />
      <FloatingObjects />
      <div className="relative z-20 min-h-screen text-white font-sans" style={{ background: 'transparent' }}>
        <Navbar />
        <main className="pt-16">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/resume" element={<ResumeBuilder />} />
              <Route path="/coverletter" element={<CoverLetter />} />
              <Route path="/ats" element={<ATSChecker />} />
              <Route path="/jdmatch" element={<JDMatcher />} />
              <Route path="/interview" element={<InterviewPrep />} />
              <Route path="/saved" element={<SavedOutputs />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
      <Toast />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}

export default App;
