import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileEdit, Copy, Download, Save, Loader } from 'lucide-react';
import { askClaude } from '../api/claude';
import { useApp } from '../context/AppContext';
import FileInput from '../components/FileInput';
import MarkdownOutput from '../components/MarkdownOutput';

const CoverLetter = () => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [tone, setTone] = useState<'professional' | 'enthusiastic' | 'concise'>('professional');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { saveOutput, showToast } = useApp();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
  };

  const handleGenerate = async () => {
    if (!name || !company || !position || !resume || !jobDescription) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const systemPrompt = `You are a professional cover letter writer. Write a compelling, personalized cover letter that showcases the candidate's qualifications and enthusiasm for the specific role. Match the tone (${tone}) and keep it professional yet engaging. Format it as a proper business letter.`;

      const userMessage = `Write a cover letter with the following details:

Candidate Name: ${name}
Target Company: ${company}
Target Position: ${position}
Tone: ${tone}

Candidate's Resume:
${resume}

Job Description:
${jobDescription}

Additional Notes: ${notes || 'None'}

Make it compelling, personalized, and highlight how the candidate's experience matches the job requirements.`;

      const letter = await askClaude(systemPrompt, userMessage);
      setOutput(letter);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to generate cover letter',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Copied to clipboard!', 'success');
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const downloadLetter = () => {
    const element = document.createElement('a');
    const file = new Blob([output], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `cover-letter-${company}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Cover letter downloaded!', 'success');
  };

  const handleSave = () => {
    saveOutput({
      type: 'coverletter',
      title: `Cover Letter — ${company}`,
      content: output,
    });
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
          <FileEdit className="text-cyan-400" size={32} />
          <h1 className="text-4xl font-bold">Cover Letter Generator</h1>
        </div>
        <p className="text-slate-400">
          Create a tailored, compelling cover letter in seconds
        </p>
      </div>

      {!output ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="glass-card p-8 space-y-4">
              <h2 className="text-xl font-semibold mb-6">Your Details</h2>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Company *
                </label>
                <input
                  type="text"
                  placeholder="Google, Microsoft, etc."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Job Role / Position *
                </label>
                <input
                  type="text"
                  placeholder="Software Engineer, Product Manager"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your Resume *
                </label>
                <FileInput onText={setResume} label="Upload or paste your resume" />
              </div>

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
                  Any Extra Notes? (optional)
                </label>
                <textarea
                  placeholder="e.g. I want to highlight my React internship specifically. Keep it under 350 words."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-20 p-4 rounded-xl bg-white/[0.06] border border-white/[0.1] text-slate-100 placeholder-slate-500 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 resize-y font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Tone
                </label>
                <div className="flex gap-2">
                  {(['professional', 'enthusiastic', 'concise'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        tone === t
                          ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Generating...
                  </>
                ) : (
                  'Generate Cover Letter'
                )}
              </button>
            </div>
          </motion.div>

          {/* Output Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 flex flex-col items-center justify-center h-full"
          >
            <FileEdit className="text-slate-600 mb-4" size={48} />
            <p className="text-slate-400 text-center">
              Your cover letter will appear here
            </p>
            <p className="text-slate-500 text-sm text-center mt-2">
              Fill in your details and hit Generate →
            </p>
          </motion.div>
        </div>
      ) : (
        // Output Section
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 glass-card p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Cover Letter</h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="btn-secondary"
                  title="Copy to clipboard"
                >
                  <Copy size={18} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={downloadLetter} className="btn-secondary">
                  <Download size={18} />
                  Download
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-h-[600px] overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-200">
              {output}
            </div>

            <button
              onClick={() => setOutput('')}
              className="btn-secondary"
            >
              ← Generate Another
            </button>
          </div>

          <div className="glass-card p-6 h-fit">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <button onClick={handleSave} className="btn-primary w-full mb-3">
              <Save size={18} />
              Save to Library
            </button>
            <div className="space-y-2 text-sm text-slate-400">
              <p>✓ Word count: ~{Math.round(output.split(' ').length)} words</p>
              <p>✓ Formatted for email</p>
              <p>✓ Professional tone</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CoverLetter;
