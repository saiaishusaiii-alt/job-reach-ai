import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Archive } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { savedOutputs } = useApp();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/resume', label: 'Resume' },
    { path: '/coverletter', label: 'Cover Letter' },
    { path: '/ats', label: 'ATS Check' },
    { path: '/jdmatch', label: 'JD Match' },
    { path: '/interview', label: 'Interview' },
    { path: '/saved', label: 'Saved' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#04050f]/70 backdrop-blur-md border-b border-white/[0.06]">
      <div className="section-wrapper flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg gradient-text hover:opacity-80 transition-opacity"
        >
          <Sparkles className="text-violet-500" size={24} />
          JobReach AI
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg transition-all duration-200 relative group ${
                isActive(item.path)
                  ? 'text-violet-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
              {isActive(item.path) && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"></div>
              )}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Saved Outputs Button */}
          <Link
            to="/saved"
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-300 hover:text-white transition-all"
          >
            <Archive size={16} />
            <span className="font-medium">{savedOutputs.length}</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {isOpen ? (
              <X size={24} className="text-slate-300" />
            ) : (
              <Menu size={24} className="text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#04050f]/95 backdrop-blur border-b border-white/[0.06]">
          <div className="section-wrapper py-4 space-y-2 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2.5 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-violet-500/20 text-violet-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
