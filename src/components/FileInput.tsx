import { useRef, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface FileInputProps {
  onText: (text: string) => void;
  label?: string;
  accept?: string;
}

const FileInput = ({ onText, label = 'Upload or paste your resume', accept = '.txt' }: FileInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === 'dragenter' || e.type === 'dragover');
  };

  const processFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'pdf' || ext === 'docx') {
      setError(
        'PDF/DOCX parsing requires a backend. Please paste your resume text below instead.'
      );
      setFileName('');
      return;
    }

    if (ext !== 'txt' && ext !== 'text') {
      setError('Only .txt files are supported. Please paste text below instead.');
      setFileName('');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onText(text);
      setFileName(file.name);
      setCharCount(text.length);
      setError('');
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    handleDrag(e);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          isDragging
            ? 'border-violet-500 bg-violet-500/10'
            : 'border-violet-500/30 hover:border-violet-500/60 bg-white/[0.02]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2 text-center">
          <Upload className="text-violet-400" size={28} />
          <p className="text-sm text-slate-200">
            {fileName ? `Loaded: ${fileName}` : label}
          </p>
          {charCount > 0 && (
            <p className="text-xs text-success badge badge-success w-fit">
              {charCount.toLocaleString()} characters
            </p>
          )}
          <p className="text-xs text-slate-500 mt-2">or drag & drop here</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Or paste text here
        </label>
        <textarea
          onChange={(e) => {
            onText(e.target.value);
            setCharCount(e.target.value.length);
            if (e.target.value) setFileName('Pasted text');
          }}
          placeholder="Paste your resume or document text here..."
          className="w-full h-32 p-4 rounded-xl bg-white/[0.06] border border-white/[0.1] text-slate-100 placeholder-slate-500 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 resize-y font-mono text-sm"
        />
      </div>
    </div>
  );
};

export default FileInput;
