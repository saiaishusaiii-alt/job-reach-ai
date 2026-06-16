import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Copy, Download, Save, Loader } from 'lucide-react';
import { askClaude } from '../api/claude';
import { useApp } from '../context/AppContext';
import FileInput from '../components/FileInput';
import ScoreRing from '../components/ScoreRing';

interface MatchResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  partialMatches: string[];
  strongPoints: string[];
  criticalGaps: string[];
  rephrasesuggestions: { current: string; suggested: string }[];
  skillsToLearn: string[];
  resumeEdits: string[];
}

const JDMatcher = () => {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [output, setOutput] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { saveOutput, showToast } = useApp();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
  };

  const handleAnalyze = async () => {
    if (!resume || !jobDescription) {
      showToast('Please provide both resume and job description', 'error');
      return;
    }

    setLoading(true);
    try {
      const systemPrompt = `You are a professional resume coach and talent acquisition expert. Compare the resume against the job description and provide a detailed gap analysis.

Respond ONLY with a valid JSON object. No markdown, no code blocks.`;

      const userMessage = `Compare this resume against this job description:

Resume:
${resume}

Job Description:
${jobDescription}

Target Role: ${targetRole || 'Not specified'}

Respond with this exact JSON structure:
{
  "matchScore": number 0-100,
  "matchedSkills": ["skill1"],
  "missingSkills": ["skill1"],
  "partialMatches": ["skill1"],
  "strongPoints": ["point1", "point2"],
  "criticalGaps": ["gap1", "gap2"],
  "rephrasesuggestions": [{"current": "text", "suggested": "better version"}],
  "skillsToLearn": ["skill1"],
  "resumeEdits": ["edit1"]
}`;

      const response = await askClaude(systemPrompt, userMessage);
      
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '');
      }
      
      const result = JSON.parse(cleanedResponse) as MatchResult;
      setOutput(result);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to analyze match',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      const text = `JD Match Score: ${output?.matchScore}/100\n\n${JSON.stringify(output, null, 2)}`;
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
        type: 'jdmatch',
        title: `JD Match — Score ${output.matchScore}`,
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
          <Target className="text-green-400" size={32} />
          <h1 className="text-4xl font-bold">Job Description Matcher</h1>
        </div>
        <p className="text-slate-400">
          See exactly how your resume matches a job posting — find the gaps before applying
        </p>
      </div>

      {!output ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 space-y-6"
          >
            <h2 className="text-xl font-semibold">Your Resume</h2>
            <FileInput onText={setResume} label="Upload or paste your resume" />
          </motion.div>

          {/* Right Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="glass-card p-8 space-y-4">
              <h2 className="text-xl font-semibold">Job Details</h2>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Job Description *
                </label>
                <textarea
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full h-32 p-4 rounded-xl bg-white/[0.06] border border-white/[0.1] text-slate-100 placeholder-slate-500 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 resize-y font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your Target Role (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer Intern at Google"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Analyzing...
                </>
              ) : (
                'Analyze Match'
              )}
            </button>
          </motion.div>
        </div>
      ) : (
        // Results
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Score */}
          <div className="glass-card p-8 text-center">
            <div className="flex justify-center mb-6">
              <ScoreRing score={output.matchScore} size={180} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Match Score</h3>
            <p className="text-slate-400 mb-6">How well your resume aligns with this job</p>
            <div className="flex gap-2 justify-center">
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

          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-6 border-l-4 border-green-500">
              <h3 className="font-semibold text-green-400 mb-3">Strong Matches</h3>
              <div className="space-y-2">
                {output.matchedSkills.map((skill, i) => (
                  <p key={i} className="text-sm text-slate-300">✓ {skill}</p>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3">Found {output.matchedSkills.length}</p>
            </div>

            <div className="glass-card p-6 border-l-4 border-red-500">
              <h3 className="font-semibold text-red-400 mb-3">Missing Skills</h3>
              <div className="space-y-2">
                {output.missingSkills.map((skill, i) => (
                  <p key={i} className="text-sm text-slate-300">✗ {skill}</p>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3">Missing {output.missingSkills.length}</p>
            </div>

            <div className="glass-card p-6 border-l-4 border-amber-500">
              <h3 className="font-semibold text-amber-400 mb-3">Partial Matches</h3>
              <div className="space-y-2">
                {output.partialMatches.slice(0, 3).map((skill, i) => (
                  <p key={i} className="text-sm text-slate-300">~ {skill}</p>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3">Could strengthen {output.partialMatches.length}</p>
            </div>
          </div>

          {/* Strong Points & Gaps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-6">
              <h3 className="font-semibold text-green-400 mb-4">What's Working Well</h3>
              <ul className="space-y-2">
                {output.strongPoints.map((point, i) => (
                  <li key={i} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-green-400">✓</span> {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-semibold text-red-400 mb-4">Critical Gaps</h3>
              <ul className="space-y-2">
                {output.criticalGaps.map((gap, i) => (
                  <li key={i} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-red-400">✗</span> {gap}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Resume Edits */}
          <div className="glass-card p-8">
            <h3 className="font-semibold text-violet-400 mb-4">Suggested Resume Edits</h3>
            <ol className="space-y-2">
              {output.resumeEdits.map((edit, i) => (
                <li key={i} className="text-sm text-slate-300">
                  <span className="font-medium text-violet-400">{i + 1}.</span> {edit}
                </li>
              ))}
            </ol>
          </div>

          {/* Skills to Learn */}
          {output.skillsToLearn.length > 0 && (
            <div className="glass-card p-8">
              <h3 className="font-semibold text-cyan-400 mb-4">Skills to Learn</h3>
              <div className="flex flex-wrap gap-2">
                {output.skillsToLearn.map((skill, i) => (
                  <span key={i} className="pill-tag bg-cyan-500/15 border-cyan-500/30 text-cyan-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setOutput(null);
              setResume('');
              setJobDescription('');
              setTargetRole('');
            }}
            className="btn-secondary"
          >
            ← Analyze Another Job
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default JDMatcher;
