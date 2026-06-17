import { motion } from 'framer-motion';
import { ArrowRight, Zap, FileText, Target, MessageSquare, Mic, Save, Github, Linkedin, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: 'Resume Builder',
      description: 'AI-powered resume generator with step-by-step wizard',
      path: '/resume'
    },
    {
      icon: MessageSquare,
      title: 'Cover Letter',
      description: 'Tailored cover letters based on your resume',
      path: '/coverletter'
    },
    {
      icon: Target,
      title: 'ATS Checker',
      description: 'Score your resume and get improvement tips',
      path: '/ats'
    },
    {
      icon: Zap,
      title: 'JD Matcher',
      description: 'Match resume against job descriptions',
      path: '/jdmatch'
    },
    {
      icon: Mic,
      title: 'Interview Prep',
      description: 'Get role-specific interview questions',
      path: '/interview'
    },
    {
      icon: Save,
      title: 'Saved Outputs',
      description: 'Access all your AI-generated content',
      path: '/saved'
    }
  ];

  const whyChooseItems = [
    'AI-Powered Analysis',
    'ATS Optimized',
    'Instant Results',
    'Professional Templates'
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="w-full min-h-screen text-white">
      {/* Hero Section - Centered */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Heading */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Land Your Dream Job with AI
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-slate-400 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            JobReach AI helps you create professional resumes, cover letters, and ace interviews using AI
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <button 
              onClick={() => navigate('/resume')}
              className="btn-primary px-8 py-4 text-lg"
            >
              Start Building Resume <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/saved')}
              className="btn-secondary px-8 py-4 text-lg"
            >
              View Saved Outputs
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-4 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-violet-400">5</div>
              <div className="text-sm text-slate-400">AI Tools</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-cyan-400">100%</div>
              <div className="text-sm text-slate-400">ATS Ready</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-pink-400">Instant</div>
              <div className="text-sm text-slate-400">Results</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Spacing & Why Choose Section */}
      <section className="py-24 px-4">
        <motion.div 
          className="section-wrapper"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text"
            variants={fadeInUp}
          >
            Why Choose JobReach?
          </motion.h2>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
          >
            {whyChooseItems.map((item, idx) => (
              <motion.div 
                key={idx}
                className="glass-card p-8 text-center hover:scale-105 transition-transform"
                variants={fadeInUp}
              >
                <Zap className="w-8 h-8 text-violet-400 mx-auto mb-3" />
                <p className="font-semibold text-lg">{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Spacing & 5 AI Powered Tools */}
      <section className="py-24 px-4">
        <motion.div 
          className="section-wrapper"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text"
            variants={fadeInUp}
          >
            5 AI Powered Tools
          </motion.h2>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={idx}
                  onClick={() => navigate(feature.path)}
                  className="glass-card p-8 cursor-pointer hover:scale-105 transition-all duration-300 hover:border-violet-400/50"
                  variants={fadeInUp}
                >
                  <Icon className="w-12 h-12 text-violet-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* Spacing & How It Works */}
      <section className="py-24 px-4">
        <motion.div 
          className="section-wrapper"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text"
            variants={fadeInUp}
          >
            How It Works
          </motion.h2>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {[
              { step: '1', title: 'Input Your Info', desc: 'Provide your background and experience' },
              { step: '2', title: 'AI Processes', desc: 'Our AI analyzes and optimizes your content' },
              { step: '3', title: 'Get Results', desc: 'Download, save, or share your materials' }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                className="glass-card p-8"
                variants={fadeInUp}
              >
                <div className="text-4xl font-bold text-violet-400 mb-3">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Spacing & Shape Our Future */}
      <section className="py-24 px-4">
        <motion.div 
          className="section-wrapper text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-8 gradient-text"
            variants={fadeInUp}
          >
            Shape Your Future Today
          </motion.h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Join thousands of job seekers who have successfully landed their dream jobs with AI-powered assistance.
          </p>
          <button 
            onClick={() => navigate('/resume')}
            className="btn-primary px-12 py-4 text-lg"
          >
            Get Started Now <ArrowRight size={20} />
          </button>
        </motion.div>
      </section>

      {/* Spacing & Get In Touch */}
      <section className="py-24 px-4 border-t border-white/10">
        <motion.div 
          className="section-wrapper"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text"
            variants={fadeInUp}
          >
            Get In Touch
          </motion.h2>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Email */}
            <motion.a 
              href="mailto:aishwaryasai@gmail.com"
              className="glass-card p-8 text-center hover:border-violet-400/50 transition-all"
              variants={fadeInUp}
            >
              <Mail className="w-8 h-8 text-violet-400 mx-auto mb-3" />
              <p className="font-semibold mb-1">Email</p>
              <p className="text-slate-400 text-sm break-all">aishwaryasai@gmail.com</p>
            </motion.a>

            {/* LinkedIn */}
            <motion.a 
              href="https://linkedin.com/in/ayinam-aishvarya-s-5b9a86292"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-8 text-center hover:border-cyan-400/50 transition-all"
              variants={fadeInUp}
            >
              <Linkedin className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <p className="font-semibold mb-1">LinkedIn</p>
              <p className="text-slate-400 text-sm">Your Profile</p>
            </motion.a>

            {/* GitHub */}
            <motion.a 
              href="https://github.com/saiaishusaiii-alt"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-8 text-center hover:border-pink-400/50 transition-all"
              variants={fadeInUp}
            >
              <Github className="w-8 h-8 text-pink-400 mx-auto mb-3" />
              <p className="font-semibold mb-1">GitHub</p>
              <p className="text-slate-400 text-sm">Open Source</p>
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10 text-center text-slate-400">
        <p>© 2024 JobReach AI. Crafted with ❤️ for your career success.</p>
      </footer>
    </div>
  );
};

export default Home;
