import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Download, Loader, ChevronDown } from 'lucide-react';
import { askClaude } from '../api/claude';
import { useApp } from '../context/AppContext';
import FileInput from '../components/FileInput';

interface Question {
  question: string;
  why: string;
  howToAnswer: string;
  hint: string;
}

interface InterviewQuestions {
  technical?: Question[];
  behavioral?: Question[];
  projectBased?: Question[];
  situational?: Question[];
  caseStudy?: Question[];
  cultureFit?: Question[];
}

const InterviewPrep = () => {
  const [resume, setResume] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [company, setCompany] = useState('');
  const [round, setRound] = useState('All Rounds');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    'technical',
    'behavioral',
    'projectBased',
    'situational',
  ]);
  const [difficulty, setDifficulty] = useState(50);
  const [output, setOutput] = useState<InterviewQuestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { saveOutput, showToast } = useApp();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleGenerate = async () => {
    if (!resume || !targetRole) {
      showToast('Please provide your resume and target role', 'error');
      return;
    }

    setLoading(true);
    try {
      const systemPrompt = `You are an expert interview coach with 15 years of experience preparing candidates for top tech companies, startups, and corporations.

Generate interview questions for a candidate based on their resume and target role.

Respond ONLY with a valid JSON object. No markdown, no code blocks.`;

      const difficultyLabel = difficulty < 40 ? 'Fresher' : difficulty < 70 ? 'Mid-level' : 'Senior';

      const userMessage = `Generate interview questions for this candidate:

Resume:
${resume}

Target Role: ${targetRole}
Target Company: ${company || 'Not specified'}
Interview Round: ${round}
Question Types: ${selectedTypes.join(', ')}
Difficulty Level: ${difficultyLabel} (${difficulty}/100)

Generate 5-6 questions per requested type. For each question include:
- The question itself
- Why interviewers ask it
- How to structure a great answer
- STAR format breakdown for behavioral questions
- Expected depth for technical questions

Respond with this JSON structure:
{
  ${selectedTypes.map((type) => `"${type}": [{"question": "...", "why": "...", "howToAnswer": "...", "hint": "..."}]`).join(',\n  ')}
}`;

      const response = await askClaude(systemPrompt, userMessage);

      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '');
      }

      const result = JSON.parse(cleanedResponse) as InterviewQuestions;
      setOutput(result);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to generate questions',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyLabel = () => {
    if (difficulty < 40) return 'Fresher';
    if (difficulty < 70) return 'Intermediate';
    return 'Senior';
  };

  const downloadAsPDF = () => {
    if (!output) return;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Interview Questions</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 40px; }
    h1 { color: #7c3aed; border-bottom: 3px solid #7c3aed; padding-bottom: 10px; }
    h2 { color: #06b6d4; margin-top: 30px; padding: 10px; background: #f0f9fa; }
    .question-card { background: #f8f8f8; padding: 20px; margin: 15px 0; border-left: 4px solid #7c3aed; page-break-inside: avoid; }
    .question-number { color: #7c3aed; font-weight: bold; font-size: 18px; }
    .question-text { font-size: 16px; font-weight: bold; margin: 10px 0; }
    .label { color: #666; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-top: 10px; }
    .content { margin-left: 10px; color: #555; }
  </style>
</head>
<body>
  <h1>Interview Preparation Questions</h1>
  <p><strong>Target Role:</strong> ${targetRole}</p>
  <p><strong>Company:</strong> ${company || 'Not specified'}</p>
  <p><strong>Difficulty:</strong> ${getDifficultyLabel()}</p>

  ${Object.entries(output)
    .map(
      ([type, questions]) =>
        `
    <h2>${type.replace(/([A-Z])/g, ' $1').trim()}</h2>
    ${(questions as Question[])
      .map(
        (q, i) => `
      <div class="question-card">
        <div class="question-number">Question ${i + 1}</div>
        <div class="question-text">${q.question}</div>
        <div class="label">Why They Ask This:</div>
        <div class="content">${q.why}</div>
        <div class="label">How to Answer:</div>
        <div class="content">${q.howToAnswer}</div>
        <div class="label">Hint/Format:</div>
        <div class="content">${q.hint}</div>
      </div>
    `
      )
      .join('')}
  `
    )
    .join('')}

  <p style="margin-top: 40px; font-size: 12px; color: #999;">Generated by JobReach AI</p>
</body>
</html>
    `;

    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
      setTimeout(() => newWindow.print(), 250);
    }
    showToast('Interview questions ready to print!', 'success');
  };

  const handleSave = () => {
    if (output) {
      saveOutput({
        type: 'interview',
        title: `Interview Prep — ${targetRole}`,
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
          <MessageSquare className="text-pink-400" size={32} />
          <h1 className="text-4xl font-bold">Interview Question Generator</h1>
        </div>
        <p className="text-slate-400">
          Get role-specific interview questions tailored to your resume and target job
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
            <h2 className="text-xl font-semibold">Your Interview Details</h2>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Your Resume *
              </label>
              <FileInput onText={setResume} label="Upload or paste your resume" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Target Job Role *
              </label>
              <input
                type="text"
                placeholder="Software Engineer Intern, Product Manager, Data Analyst"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Target Company (optional)
              </label>
              <input
                type="text"
                placeholder="Google, Infosys, any startup"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Interview Round
              </label>
              <select
                value={round}
                onChange={(e) => setRound(e.target.value)}
                className="w-full"
              >
                <option>HR Screening</option>
                <option>Technical Round</option>
                <option>Managerial</option>
                <option>Final Round</option>
                <option>All Rounds</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Question Types
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'technical', label: 'Technical / Coding' },
                  { id: 'behavioral', label: 'Behavioral (STAR)' },
                  { id: 'projectBased', label: 'Project-Based' },
                  { id: 'situational', label: 'Situational' },
                  { id: 'caseStudy', label: 'Case Study' },
                  { id: 'cultureFit', label: 'Culture Fit' },
                ].map((type) => (
                  <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.id)}
                      onChange={() => toggleType(type.id)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-slate-300">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Difficulty Level: <span className="text-violet-400">{getDifficultyLabel()}</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Fresher</span>
                <span>Intermediate</span>
                <span>Senior</span>
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
                  Preparing your questions...
                </>
              ) : (
                'Generate Interview Questions'
              )}
            </button>
          </motion.div>

          {/* Info Card */}
          <div className="glass-card p-6 h-fit">
            <h3 className="font-semibold mb-4">Interview Tips</h3>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>✓ Use STAR method for behavioral questions</li>
              <li>✓ Practice your answers out loud</li>
              <li>✓ Prepare 2-3 examples for each skill</li>
              <li>✓ Research the company before the interview</li>
              <li>✓ Ask thoughtful questions about the role</li>
            </ul>
          </div>
        </div>
      ) : (
        // Results
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Action Buttons */}
          <div className="flex gap-2 sticky top-20 z-10 flex-wrap">
            <button onClick={downloadAsPDF} className="btn-primary">
              <Download size={18} />
              Download as PDF
            </button>
            <button onClick={handleSave} className="btn-secondary">
              Save to Library
            </button>
            <button
              onClick={() => {
                setOutput(null);
                setResume('');
                setTargetRole('');
              }}
              className="btn-secondary"
            >
              ← Generate New Set
            </button>
          </div>

          {/* Questions by Type */}
          {Object.entries(output).map(([type, questions]) => (
            <div key={type} className="space-y-4">
              <h2 className="text-2xl font-bold gradient-text">
                {type.replace(/([A-Z])/g, ' $1').trim()}
              </h2>

              {(questions as Question[]).map((q, idx) => (
                <div key={idx} className="glass-card overflow-hidden">
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                    className="w-full p-6 text-left hover:bg-white/5 transition-colors flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <span className="text-violet-400 font-bold text-lg flex-shrink-0">
                          Q{idx + 1}
                        </span>
                        <p className="font-semibold text-white text-left">{q.question}</p>
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-slate-400 flex-shrink-0 transition-transform ${
                        expandedIndex === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedIndex === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/10 p-6 space-y-4 bg-white/[0.02]"
                    >
                      <div>
                        <h4 className="font-semibold text-amber-400 mb-2">Why They Ask This:</h4>
                        <p className="text-slate-300 text-sm">{q.why}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-cyan-400 mb-2">How to Answer:</h4>
                        <p className="text-slate-300 text-sm whitespace-pre-wrap">{q.howToAnswer}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-violet-400 mb-2">
                          {type.includes('behavioral') ? 'STAR Format Hint:' : 'Expected Depth:'}
                        </h4>
                        <p className="text-slate-300 text-sm whitespace-pre-wrap">{q.hint}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default InterviewPrep;
