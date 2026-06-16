import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, FileEdit, BarChart2, Target, MessageSquare, Archive, ChevronDown } from 'lucide-react';

const Home = () => {
  const tools = [
    {
      icon: FileText,
      name: 'Resume Builder',
      description: 'Fill out your full professional profile and get a polished, ATS-ready resume in seconds.',
      path: '/resume',
      color: 'from-violet-500/20 to-cyan-500/10',
    },
    {
      icon: FileEdit,
      name: 'Cover Letter Generator',
      description: 'Paste your resume + job description and get a tailored, compelling cover letter.',
      path: '/coverletter',
      color: 'from-cyan-500/20 to-pink-500/10',
    },
    {
      icon: BarChart2,
      name: 'ATS Compatibility Checker',
      description: 'Check if your resume will pass Applicant Tracking Systems. Get a score + fixes.',
      path: '/ats',
      color: 'from-pink-500/20 to-violet-500/10',
    },
    {
      icon: Target,
      name: 'JD Matcher',
      description: 'Paste a job description and see exactly how well your resume matches. Identify gaps.',
      path: '/jdmatch',
      color: 'from-violet-500/20 to-pink-500/10',
    },
    {
      icon: MessageSquare,
      name: 'Interview Prep',
      description: 'Get role-specific interview questions generated from your resume and target job.',
      path: '/interview',
      color: 'from-cyan-500/20 to-violet-500/10',
    },
    {
      icon: Archive,
      name: 'Saved Outputs',
      description: 'All your generated resumes, letters, and analyses saved locally.',
      path: '/saved',
      color: 'from-pink-500/20 to-cyan-500/10',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Fill Details',
      description: 'Enter your information or upload existing content',
      icon: FileText,
    },
    {
      number: '02',
      title: 'AI Generates',
      description: 'Claude AI creates tailored, professional content',
      icon: FileEdit,
    },
    {
      number: '03',
      title: 'Apply & Succeed',
      description: 'Use your polished materials to land interviews',
      icon: Target,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="section-wrapper pt-24 pb-16">
        <div className="text-center space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-block"
          >
            <div className="badge badge-violet">
              <span>✦</span>
              <span>AI-Powered · Free to Use</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              Land Your Dream Job with{' '}
              <span className="gradient-text">AI</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              5 intelligent tools that build your resume, write cover letters, optimize for
              ATS, match job descriptions, and prepare you for interviews — all in one place.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link to="/resume" className="btn-primary">
              Start Building
            </Link>
            <button
              onClick={() => {
                document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-secondary"
            >
              View All Tools
            </button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center pt-8"
          >
            <ChevronDown className="text-violet-500/60" size={24} />
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="section-wrapper py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center">5 AI-Powered Tools</h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.name}
                  variants={{
                    hidden: { opacity: 0, scale: 0.94, y: 20 },
                    show: {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      transition: { duration: 0.4, ease: 'easeOut' },
                    },
                  }}
                >
                  <Link
                    to={tool.path}
                    className="glass-card p-6 h-full flex flex-col hover:scale-105 transition-transform duration-300"
                  >
                    <div
                      className={`bg-gradient-to-br ${tool.color} rounded-xl p-4 w-fit mb-4`}
                    >
                      <Icon className="text-cyan-400" size={28} />
                    </div>
                    <h3 className="font-semibold text-white text-lg mb-2">{tool.name}</h3>
                    <p className="text-sm text-slate-400 mb-4 flex-1">{tool.description}</p>
                    <span className="text-violet-400 font-medium text-sm hover:text-violet-300">
                      Open Tool →
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="section-wrapper py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="glass-card p-8 text-center relative"
                >
                  {/* Step Number */}
                  <div className="text-5xl font-bold gradient-text mb-4">{step.number}</div>

                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-violet-500/20 to-cyan-500/10 rounded-xl p-4 w-fit">
                      <StepIcon className="text-violet-400" size={32} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-white text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.description}</p>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500"></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="section-wrapper py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to Land Your Dream Job?</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Start with your resume and let AI help you every step of the way.
          </p>
          <Link to="/resume" className="btn-primary inline-block mt-4">
            Get Started Free
          </Link>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Home;
