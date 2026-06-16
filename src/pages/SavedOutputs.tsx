import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, Copy, Download, Trash2, X } from 'lucide-react';
import { useApp, SavedOutput } from '../context/AppContext';

const SavedOutputs = () => {
  const { savedOutputs, deleteOutput, showToast } = useApp();
  const [filterType, setFilterType] = useState<'all' | SavedOutput['type']>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
  };

  const filtered = useMemo(() => {
    let items = savedOutputs;

    if (filterType !== 'all') {
      items = items.filter((item) => item.type === filterType);
    }

    if (sortBy === 'newest') {
      items = [...items].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      items = [...items].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return items;
  }, [savedOutputs, filterType, sortBy]);

  const typeColors: Record<SavedOutput['type'], { bg: string; text: string; label: string }> = {
    resume: { bg: 'bg-violet-500/20', text: 'text-violet-400', label: 'Resume' },
    coverletter: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', label: 'Cover Letter' },
    ats: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'ATS Report' },
    jdmatch: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'JD Match' },
    interview: { bg: 'bg-pink-500/20', text: 'text-pink-400', label: 'Interview Prep' },
  };

  const copyToClipboard = async (id: string) => {
    const item = savedOutputs.find((o) => o.id === id);
    if (!item) return;

    try {
      await navigator.clipboard.writeText(item.content);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
      showToast('Copied to clipboard!', 'success');
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const downloadItem = (item: SavedOutput) => {
    const ext = item.type === 'coverletter' ? '.txt' : '.json';
    const filename = `${item.title.toLowerCase().replace(/\s+/g, '-')}${ext}`;

    const element = document.createElement('a');
    const file = new Blob([item.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`Downloaded: ${filename}`, 'success');
  };

  const handleDelete = (id: string) => {
    deleteOutput(id);
    setDeleteConfirm(null);
    setExpandedId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
          <Archive className="text-blue-400" size={32} />
          <h1 className="text-4xl font-bold">Saved Outputs</h1>
        </div>
        <p className="text-slate-400">
          All your AI-generated career content — {savedOutputs.length} item
          {savedOutputs.length !== 1 ? 's' : ''} saved locally
        </p>
      </div>

      {savedOutputs.length > 0 ? (
        <>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  filterType === 'all'
                    ? 'bg-violet-500 text-white'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              {['resume', 'coverletter', 'ats', 'jdmatch', 'interview'].map((type) => {
                const count = savedOutputs.filter((o) => o.type === type as SavedOutput['type']).length;
                if (count === 0) return null;
                return (
                  <button
                    key={type}
                    onClick={() => setFilterType(type as SavedOutput['type'])}
                    className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                      filterType === type
                        ? 'bg-violet-500 text-white'
                        : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {typeColors[type as SavedOutput['type']].label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filtered.map((item) => {
                  const typeInfo = typeColors[item.type];
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-card overflow-hidden group cursor-pointer hover:border-violet-500/50 transition-all"
                    >
                      {/* Card Header */}
                      <div className="p-4 border-b border-white/10 flex items-start justify-between">
                        <span className={`badge ${typeInfo.bg} ${typeInfo.text}`}>
                          {typeInfo.label}
                        </span>
                        <div className="flex gap-1">
                          {deleteConfirm === item.id ? (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(item.id);
                                }}
                                className="p-1 rounded hover:bg-red-500/20 transition-colors"
                                title="Confirm delete"
                              >
                                <Trash2 size={16} className="text-red-400" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirm(null);
                                }}
                                className="p-1 rounded hover:bg-slate-500/20 transition-colors"
                                title="Cancel"
                              >
                                <X size={16} className="text-slate-400" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirm(item.id);
                              }}
                              className="p-1 rounded hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="p-4 space-y-2"
                      >
                        <h3 className="font-semibold text-white line-clamp-2 text-sm">{item.title}</h3>
                        <p className="text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {item.content.substring(0, 100)}...
                        </p>
                      </div>

                      {/* Expanded Preview */}
                      <AnimatePresence>
                        {expandedId === item.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-white/10 p-4 bg-white/[0.02] max-h-48 overflow-y-auto"
                          >
                            <p className="text-xs text-slate-300 font-mono whitespace-pre-wrap">
                              {item.content.substring(0, 500)}
                              {item.content.length > 500 && '...'}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Actions */}
                      <div className="border-t border-white/10 p-3 bg-white/[0.02] flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(item.id);
                          }}
                          className="flex-1 btn-secondary text-xs py-1.5"
                          title="Copy"
                        >
                          <Copy size={14} />
                          {copied === item.id ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadItem(item);
                          }}
                          className="flex-1 btn-secondary text-xs py-1.5"
                          title="Download"
                        >
                          <Download size={14} />
                          Download
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-12 glass-card">
              <Archive className="mx-auto mb-4 text-slate-600" size={48} />
              <p className="text-slate-400">
                No {filterType !== 'all' ? filterType : ''} items yet
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Try generating some content to see it here
              </p>
            </div>
          )}
        </>
      ) : (
        // Empty State
        <div className="text-center py-20 glass-card space-y-4">
          <Archive className="mx-auto text-slate-600" size={64} />
          <h2 className="text-2xl font-bold text-slate-300">Nothing saved yet</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Start using the AI tools to generate resumes, cover letters, and more. Everything will be
            saved here automatically.
          </p>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Explore Tools
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default SavedOutputs;
