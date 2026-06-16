import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Copy, Download, Save, Loader } from 'lucide-react';
import { askClaude } from '../api/claude';
import { useApp } from '../context/AppContext';
import FileInput from '../components/FileInput';
import ScoreRing from '../components/ScoreRing';

interface ATSScore {
  score: number;
  interpretation: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  tips: string[];
  sectionAnalysis: { section: string; status: string; note: string }[];
}

const ATSChecker = () => {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [output, setOutput] = useState<ATSScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { saveOutput, showToast } = useApp();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
  };

  const handleAnalyze = async () => {
    if (!resume) {
      showToast('Please provide your resume', 'error');
      return;
    }

    setLoading(true);
    try {
      const systemPrompt = `You are a professional ATS (Applicant Tracking System) analyzer and resume expert. Analyze the resume for ATS compatibility.

Respond ONLY with a valid JSON object. No markdown, no code blocks, no explanation.
Start with { and end with }.`;

      const userMessage = `Analyze this resume for ATS compatibility.

Resume:
${resume}

${jobDescription ? `Job Description:\n${jobDescription}` : 'No job description provided — analyze general ATS compatibility'}

Respond with this exact JSON structure:
{
  "score": number between 0-100,
  "interpretation": "one sentence summary",
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "sectionAnalysis": [{"section": "name", "status": "good/warning/bad", "note": "note"}]
}`;

      const response = await askClaude(systemPrompt, userMessage);
      
      // Clean response - remove markdown code blocks if present
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '');
      }
      
      const result = JSON.parse(cleanedResponse) as ATSScore;
      setOutput(result);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to analyze resume',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      const text = `ATS Score: ${output?.score}/100\n\n${JSON.stringify(output, null, 2)}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Copied to clipboard!', 'success');
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleSave = () => {
    if (output) {
      saveOutput({
        type: 'ats',
        title: `ATS Report — Score ${output.score}`,
        content: JSON.stringify(output, null, 2),
      });
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="section-wrapper py-10 space-y-8"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <BarChart2 className="text-amber-400" size={32} />
          <h1 className="text-4xl font-bold">ATS Compatibility Checker</h1>
        </div>
        <p className="text-slate-400">
          Find out if your resume will survive Applicant Tracking Systems
        </p>
      </div>

      {!output ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 glass-card p-8 space-y-6"
          >
            <h2 className="text-xl font-semibold">Analyze Your Resume</h2>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Your Resume *
              </label>
              <FileInput onText={setResume} label="Upload or paste your resume" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Target Job Description (optional but recommended)
              </label>
              <textarea
                placeholder="Paste a job description for improved accuracy..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full h-32 p-4 rounded-xl bg-white/[0.06] border border-white/[0.1] text-slate-100 placeholder-slate-500 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 resize-y font-mono text-sm"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Running Analysis...
                </>
              ) : (
                'Run ATS Analysis'
              )}
            </button>
          </motion.div>

          {/* Info Card */}
          <div className="glass-card p-6 h-fit">
            <h3 className="font-semibold mb-4">What is ATS?</h3>
            <p className="text-sm text-slate-400 space-y-2">
              <p>ATS (Applicant Tracking System) software automatically filters resumes before human review.</p>
              <p className="mt-2">A high ATS score means your resume will actually reach recruiters.</p>
            </p>
          </div>
        </div>
      ) : (
        // Results
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Score */}
          <div className="glass-card p-8">
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <ScoreRing score={output.score} size={160} label="ATS Score" />
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {output.score < 40
                      ? '⚠ Needs Major Work'
                      : output.score < 70
                        ? '△ Needs Improvement'
                        : output.score < 85
                          ? '✓ Good'
                          : '✦ Excellent'}
                  </h3>
                  <p className="text-slate-400">{output.interpretation}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="btn-secondary">
                    <Copy size={18} />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={handleSave} className="btn-secondary">
                    <Save size={18} />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-6 border-l-4 border-green-500">
              <h3 className="font-semibold text-green-400 mb-4">Matched Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {output.matchedKeywords.map((keyword, i) => (
                  <span key={i} className="pill-tag bg-green-500/15 border-green-500/30 text-green-400">
                    ✓ {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 border-l-4 border-red-500">
              <h3 className="font-semibold text-red-400 mb-4">Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {output.missingKeywords.map((keyword, i) => (
                  <span key={i} className="pill-tag bg-red-500/15 border-red-500/30 text-red-400">
                    ✗ {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="glass-card p-8">
            <h3 className="font-semibold text-amber-400 mb-4">Improvement Tips</h3>
            <div className="space-y-3">
              {output.tips.map((tip, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-amber-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-slate-300">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section Analysis */}
          {output.sectionAnalysis && output.sectionAnalysis.length > 0 && (
            <div className="glass-card p-8">
              <h3 className="font-semibold mb-4">Section Analysis</h3>
              <div className="space-y-2">
                {output.sectionAnalysis.map((section, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="font-medium text-slate-200">{section.section}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          section.status === 'good'
                            ? 'text-green-400'
                            : section.status === 'warning'
                              ? 'text-amber-400'
                              : 'text-red-400'
                        }`}
                      >
                        {section.status === 'good' ? '✓' : section.status === 'warning' ? '△' : '✗'}{' '}
                        {section.note}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setOutput(null);
              setResume('');
              setJobDescription('');
            }}
            className="btn-secondary"
          >
            ← Analyze Another Resume
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ATSChecker;
