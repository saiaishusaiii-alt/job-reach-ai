import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Copy, Download, Save, Loader } from 'lucide-react';
import { askClaude } from '../api/claude';
import { useApp } from '../context/AppContext';
import MarkdownOutput from '../components/MarkdownOutput';

const ResumeBuilder = () => {
  const [mode, setMode] = useState<'wizard' | 'paste'>('wizard');
  const [step, setStep] = useState(1);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { saveOutput, showToast } = useApp();

  // Wizard Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    linkedIn: '',
    github: '',
    portfolio: '',

    // Step 2: Experience
    experience: [
      { company: '', role: '', type: 'Full-time', startDate: '', endDate: '', current: false, description: '' },
    ],

    // Step 3: Projects
    projects: [
      { name: '', description: '', techStack: '', contributions: '', github: '', demo: '' },
    ],

    // Step 4: Education & Skills
    education: [
      { institution: '', degree: '', startYear: '', graduationYear: '', cgpa: '', coursework: '' },
    ],
    skills: '',
    tools: '',
    softSkills: '',
    certifications: '',
    achievements: '',
    languages: '',
  });

  const [pasteText, setPasteText] = useState('');
  const [pasteImprovement, setPasteImprovement] = useState('');

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
  };

  // Validation
  const validateStep = (stepNum: number) => {
    const errors = [];
    if (stepNum === 1) {
      if (!formData.fullName) errors.push('Full Name');
      if (!formData.email) errors.push('Email');
      if (!formData.phone) errors.push('Phone');
      if (!formData.location) errors.push('Location');
      if (!formData.title) errors.push('Professional Title');
    }
    if (stepNum === 3) {
      if (formData.projects.some((p) => !p.name || !p.description || !p.techStack)) {
        errors.push('All project fields are required');
      }
    }
    if (stepNum === 4) {
      if (formData.education.some((e) => !e.institution || !e.degree || !e.startYear || !e.graduationYear)) {
        errors.push('All education fields are required');
      }
    }
    return errors;
  };

  const errors = useMemo(() => validateStep(step), [step, formData]);

  const handleWizardSubmit = async () => {
    if (errors.length > 0) {
      showToast(`Please fill in: ${errors.join(', ')}`, 'error');
      return;
    }

    setLoading(true);
    try {
      const systemPrompt = `You are a professional resume writer and career coach. Create a polished, ATS-friendly resume from the provided information. Use strong action verbs, quantify achievements, and format clearly with sections for Contact, Professional Summary, Experience, Projects, Education, Skills, Certifications, Languages, and Achievements.`;

      const userMessage = `Create a professional resume with this information:

Personal Info:
- Name: ${formData.fullName}
- Email: ${formData.email}
- Phone: ${formData.phone}
- Location: ${formData.location}
- Title: ${formData.title}
- LinkedIn: ${formData.linkedIn || 'N/A'}
- GitHub: ${formData.github || 'N/A'}
- Portfolio: ${formData.portfolio || 'N/A'}

Experience:
${formData.experience.map((e) => `- ${e.role} at ${e.company} (${e.type}) ${e.startDate} - ${e.current ? 'Present' : e.endDate}\n  ${e.description}`).join('\n')}

Projects:
${formData.projects.map((p) => `- ${p.name}\n  ${p.description}\n  Tech: ${p.techStack}\n  Contribution: ${p.contributions}\n  GitHub: ${p.github || 'N/A'}\n  Demo: ${p.demo || 'N/A'}`).join('\n')}

Education:
${formData.education.map((e) => `- ${e.degree} from ${e.institution} (${e.startYear}-${e.graduationYear})\n  CGPA: ${e.cgpa || 'N/A'}\n  Coursework: ${e.coursework || 'N/A'}`).join('\n')}

Skills:
- Technical: ${formData.skills}
- Tools: ${formData.tools}
- Soft Skills: ${formData.softSkills}
- Languages: ${formData.languages}

Certifications: ${formData.certifications || 'None'}
Achievements: ${formData.achievements || 'None'}`;

      const resume = await askClaude(systemPrompt, userMessage);
      setOutput(resume);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to generate resume',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasteOptimize = async () => {
    if (!pasteText.trim()) {
      showToast('Please paste your resume text', 'error');
      return;
    }

    setLoading(true);
    try {
      const systemPrompt = `You are a professional resume writer. Optimize and reformat the provided resume to be ATS-friendly, more professional, and impactful. Use strong action verbs, quantify achievements where possible, and improve formatting.`;

      const userMessage = `Optimize this resume${pasteImprovement ? ` with focus on: ${pasteImprovement}` : ''}:\n\n${pasteText}`;

      const resume = await askClaude(systemPrompt, userMessage);
      setOutput(resume);
      setPasteText('');
      setPasteImprovement('');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to optimize resume',
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

  const downloadResume = () => {
    const element = document.createElement('a');
    const file = new Blob([output], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `resume-${formData.fullName}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Resume downloaded!', 'success');
  };

  const handleSave = () => {
    saveOutput({
      type: 'resume',
      title: `Resume — ${formData.fullName || 'Untitled'}`,
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
          <FileText className="text-violet-400" size={32} />
          <h1 className="text-4xl font-bold">Resume Builder AI</h1>
        </div>
        <p className="text-slate-400">
          Fill in your details and receive a complete, professional resume
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 w-fit bg-white/5 p-1 rounded-xl border border-white/10">
        <button
          onClick={() => {
            setMode('wizard');
            setStep(1);
            setOutput('');
          }}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            mode === 'wizard'
              ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Build Step-by-Step
        </button>
        <button
          onClick={() => {
            setMode('paste');
            setOutput('');
          }}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            mode === 'paste'
              ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Paste & Optimize
        </button>
      </div>

      {/* Content */}
      {!output ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {mode === 'wizard' ? (
              // Wizard Mode
              <>
                {/* Progress */}
                <div className="space-y-4">
                  <div className="flex gap-2 justify-between">
                    {[1, 2, 3, 4].map((s) => (
                      <div key={s} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-full font-semibold flex items-center justify-center ${
                            s < step
                              ? 'bg-success text-white'
                              : s === step
                                ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white'
                                : 'bg-white/10 text-slate-400'
                          }`}
                        >
                          {s < step ? '✓' : s}
                        </div>
                        {s < 4 && (
                          <div className={`flex-1 w-0.5 ${s < step ? 'bg-success' : 'bg-white/10'}`}></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Content */}
                <motion.div
                  key={`step-${step}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-8 space-y-6"
                >
                  {step === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Personal Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="col-span-1 sm:col-span-2"
                        />
                        <input
                          type="email"
                          placeholder="Professional Email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="col-span-1 sm:col-span-2"
                        />
                        <input
                          type="text"
                          placeholder="Professional Title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="col-span-1 sm:col-span-2"
                        />
                        <input
                          type="url"
                          placeholder="LinkedIn URL (optional)"
                          value={formData.linkedIn}
                          onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                        />
                        <input
                          type="url"
                          placeholder="GitHub URL (optional)"
                          value={formData.github}
                          onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        />
                        <input
                          type="url"
                          placeholder="Portfolio URL (optional)"
                          value={formData.portfolio}
                          onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                          className="col-span-1 sm:col-span-2"
                        />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Work Experience & Internships</h3>
                      {formData.experience.map((exp, idx) => (
                        <div key={idx} className="glass-card p-4 space-y-3 border border-white/5">
                          <input
                            type="text"
                            placeholder="Company / Organization"
                            value={exp.company}
                            onChange={(e) => {
                              const newExp = [...formData.experience];
                              newExp[idx].company = e.target.value;
                              setFormData({ ...formData, experience: newExp });
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Your Role / Title"
                            value={exp.role}
                            onChange={(e) => {
                              const newExp = [...formData.experience];
                              newExp[idx].role = e.target.value;
                              setFormData({ ...formData, experience: newExp });
                            }}
                          />
                          <select
                            value={exp.type}
                            onChange={(e) => {
                              const newExp = [...formData.experience];
                              newExp[idx].type = e.target.value;
                              setFormData({ ...formData, experience: newExp });
                            }}
                          >
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Internship</option>
                            <option>Freelance</option>
                          </select>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Start Month & Year"
                              value={exp.startDate}
                              onChange={(e) => {
                                const newExp = [...formData.experience];
                                newExp[idx].startDate = e.target.value;
                                setFormData({ ...formData, experience: newExp });
                              }}
                            />
                            {!exp.current && (
                              <input
                                type="text"
                                placeholder="End Month & Year"
                                value={exp.endDate}
                                onChange={(e) => {
                                  const newExp = [...formData.experience];
                                  newExp[idx].endDate = e.target.value;
                                  setFormData({ ...formData, experience: newExp });
                                }}
                              />
                            )}
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => {
                                const newExp = [...formData.experience];
                                newExp[idx].current = e.target.checked;
                                setFormData({ ...formData, experience: newExp });
                              }}
                              className="rounded w-4 h-4"
                            />
                            <span className="text-sm text-slate-300">Currently working here</span>
                          </label>
                          <textarea
                            placeholder="Key Responsibilities & Achievements\n• Achievement 1\n• Achievement 2"
                            value={exp.description}
                            onChange={(e) => {
                              const newExp = [...formData.experience];
                              newExp[idx].description = e.target.value;
                              setFormData({ ...formData, experience: newExp });
                            }}
                            className="h-24"
                          />
                          {formData.experience.length > 1 && (
                            <button
                              onClick={() => {
                                const newExp = formData.experience.filter((_, i) => i !== idx);
                                setFormData({ ...formData, experience: newExp });
                              }}
                              className="text-sm text-error hover:text-red-400"
                            >
                              ✕ Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            experience: [
                              ...formData.experience,
                              { company: '', role: '', type: 'Full-time', startDate: '', endDate: '', current: false, description: '' },
                            ],
                          })
                        }
                        className="btn-secondary"
                      >
                        + Add Another Role
                      </button>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Projects</h3>
                      {formData.projects.map((proj, idx) => (
                        <div key={idx} className="glass-card p-4 space-y-3 border border-white/5">
                          <input
                            type="text"
                            placeholder="Project Name"
                            value={proj.name}
                            onChange={(e) => {
                              const newProj = [...formData.projects];
                              newProj[idx].name = e.target.value;
                              setFormData({ ...formData, projects: newProj });
                            }}
                          />
                          <textarea
                            placeholder="Brief Description"
                            value={proj.description}
                            onChange={(e) => {
                              const newProj = [...formData.projects];
                              newProj[idx].description = e.target.value;
                              setFormData({ ...formData, projects: newProj });
                            }}
                            className="h-20"
                          />
                          <input
                            type="text"
                            placeholder="Tech Stack (e.g., React, Node.js, MongoDB)"
                            value={proj.techStack}
                            onChange={(e) => {
                              const newProj = [...formData.projects];
                              newProj[idx].techStack = e.target.value;
                              setFormData({ ...formData, projects: newProj });
                            }}
                          />
                          <textarea
                            placeholder="Your Role & Key Contributions"
                            value={proj.contributions}
                            onChange={(e) => {
                              const newProj = [...formData.projects];
                              newProj[idx].contributions = e.target.value;
                              setFormData({ ...formData, projects: newProj });
                            }}
                            className="h-20"
                          />
                          <input
                            type="url"
                            placeholder="GitHub Repository URL (optional)"
                            value={proj.github}
                            onChange={(e) => {
                              const newProj = [...formData.projects];
                              newProj[idx].github = e.target.value;
                              setFormData({ ...formData, projects: newProj });
                            }}
                          />
                          <input
                            type="url"
                            placeholder="Live Demo URL (optional)"
                            value={proj.demo}
                            onChange={(e) => {
                              const newProj = [...formData.projects];
                              newProj[idx].demo = e.target.value;
                              setFormData({ ...formData, projects: newProj });
                            }}
                          />
                          {formData.projects.length > 1 && (
                            <button
                              onClick={() => {
                                const newProj = formData.projects.filter((_, i) => i !== idx);
                                setFormData({ ...formData, projects: newProj });
                              }}
                              className="text-sm text-error hover:text-red-400"
                            >
                              ✕ Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            projects: [
                              ...formData.projects,
                              { name: '', description: '', techStack: '', contributions: '', github: '', demo: '' },
                            ],
                          })
                        }
                        className="btn-secondary"
                      >
                        + Add Project
                      </button>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">Education</h4>
                        {formData.education.map((edu, idx) => (
                          <div key={idx} className="glass-card p-4 mb-3 space-y-3 border border-white/5">
                            <input
                              type="text"
                              placeholder="Institution Name"
                              value={edu.institution}
                              onChange={(e) => {
                                const newEdu = [...formData.education];
                                newEdu[idx].institution = e.target.value;
                                setFormData({ ...formData, education: newEdu });
                              }}
                            />
                            <input
                              type="text"
                              placeholder="Degree & Stream"
                              value={edu.degree}
                              onChange={(e) => {
                                const newEdu = [...formData.education];
                                newEdu[idx].degree = e.target.value;
                                setFormData({ ...formData, education: newEdu });
                              }}
                            />
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="text"
                                placeholder="Start Year"
                                value={edu.startYear}
                                onChange={(e) => {
                                  const newEdu = [...formData.education];
                                  newEdu[idx].startYear = e.target.value;
                                  setFormData({ ...formData, education: newEdu });
                                }}
                              />
                              <input
                                type="text"
                                placeholder="Grad Year"
                                value={edu.graduationYear}
                                onChange={(e) => {
                                  const newEdu = [...formData.education];
                                  newEdu[idx].graduationYear = e.target.value;
                                  setFormData({ ...formData, education: newEdu });
                                }}
                              />
                              <input
                                type="text"
                                placeholder="CGPA (optional)"
                                value={edu.cgpa}
                                onChange={(e) => {
                                  const newEdu = [...formData.education];
                                  newEdu[idx].cgpa = e.target.value;
                                  setFormData({ ...formData, education: newEdu });
                                }}
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Relevant Coursework (optional, comma-separated)"
                              value={edu.coursework}
                              onChange={(e) => {
                                const newEdu = [...formData.education];
                                newEdu[idx].coursework = e.target.value;
                                setFormData({ ...formData, education: newEdu });
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Skills</h4>
                        <input
                          type="text"
                          placeholder="Technical Skills (comma-separated)"
                          value={formData.skills}
                          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Tools & Technologies (comma-separated)"
                          value={formData.tools}
                          onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                          className="mt-2"
                        />
                        <input
                          type="text"
                          placeholder="Soft Skills (comma-separated)"
                          value={formData.softSkills}
                          onChange={(e) => setFormData({ ...formData, softSkills: e.target.value })}
                          className="mt-2"
                        />
                        <input
                          type="text"
                          placeholder="Languages (comma-separated)"
                          value={formData.languages}
                          onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Certifications (optional)</h4>
                        <input
                          type="text"
                          placeholder="Certification Name, Issuer, Year (comma-separated)"
                          value={formData.certifications}
                          onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                        />
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Achievements (optional)</h4>
                        <textarea
                          placeholder="Hackathons, Open Source, Competitions, Awards, etc."
                          value={formData.achievements}
                          onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                          className="h-24"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Navigation */}
                <div className="flex gap-3">
                  {step > 1 && (
                    <button onClick={() => setStep(step - 1)} className="btn-secondary">
                      ← Previous
                    </button>
                  )}
                  {step < 4 ? (
                    <button
                      onClick={() => {
                        if (errors.length === 0) {
                          setStep(step + 1);
                        } else {
                          showToast(`Please fill in: ${errors.join(', ')}`, 'error');
                        }
                      }}
                      className="btn-primary flex-1"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      onClick={handleWizardSubmit}
                      disabled={loading}
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader className="animate-spin" size={18} />
                          Building your resume...
                        </>
                      ) : (
                        'Generate My Resume'
                      )}
                    </button>
                  )}
                </div>
              </>
            ) : (
              // Paste Mode
              <div className="glass-card p-8 space-y-6">
                <h3 className="text-xl font-semibold">Paste & Optimize</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Paste your existing resume text
                  </label>
                  <textarea
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    placeholder="Paste your resume here..."
                    className="w-full h-48 p-4 rounded-xl bg-white/[0.06] border border-white/[0.1] text-slate-100 placeholder-slate-500 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 resize-y font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    What to improve? (optional)
                  </label>
                  <input
                    type="text"
                    value={pasteImprovement}
                    onChange={(e) => setPasteImprovement(e.target.value)}
                    placeholder="e.g. More ATS-friendly, stronger action verbs, better formatting"
                  />
                </div>
                <button
                  onClick={handlePasteOptimize}
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Optimizing...
                    </>
                  ) : (
                    'Optimize & Rebuild'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">Tips coming here</div>
        </div>
      ) : (
        // Output Section
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Generated Resume</h2>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="btn-secondary"
                title="Copy to clipboard"
              >
                <Copy size={18} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={downloadResume} className="btn-secondary">
                <Download size={18} />
                Download
              </button>
              <button onClick={handleSave} className="btn-secondary">
                <Save size={18} />
                Save
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-h-[600px] overflow-y-auto">
            <MarkdownOutput content={output} />
          </div>

          <button
            onClick={() => setOutput('')}
            className="btn-secondary"
          >
            ← Generate Another
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ResumeBuilder;
