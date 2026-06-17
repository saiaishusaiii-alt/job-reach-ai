import { useState } from 'react';
import { Upload, X, File } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { uploadResume, getUploadedResumes } from '../api/resumeApi';

interface ResumeUploadProps {
  onUploadSuccess?: (file: any) => void;
}

const ResumeUploadComponent = ({ onUploadSuccess }: ResumeUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [error, setError] = useState('');
  const { showToast } = useAppContext();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const handleFileSelect = async (files: FileList) => {
    setError('');
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF, DOC, and DOCX files are allowed');
        continue;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        continue;
      }

      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await uploadResume(file);
      
      if (response.success) {
        setUploadedFiles([...uploadedFiles, response.file]);
        showToast(`Resume "${file.name}" uploaded successfully!`, 'success');
        
        if (onUploadSuccess) {
          onUploadSuccess(response.file);
        }

        // Refresh the list
        await loadUploadedResumes();
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const loadUploadedResumes = async () => {
    try {
      const response = await getUploadedResumes();
      setUploadedFiles(response.files || []);
    } catch (err) {
      console.error('Failed to load resumes:', err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Area */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleFileDrop}
        className={`glass-card p-12 text-center cursor-pointer transition-all border-2 ${
          isDragging
            ? 'border-violet-400 bg-violet-400/10'
            : 'border-dashed border-slate-600 hover:border-violet-400'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <input
          type="file"
          id="resume-input"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={handleFileInput}
          className="hidden"
          disabled={isUploading}
        />

        <label htmlFor="resume-input" className="cursor-pointer">
          <motion.div
            animate={{ scale: isDragging ? 1.1 : 1 }}
            className="space-y-4"
          >
            <Upload className="w-12 h-12 mx-auto text-violet-400" />
            <div>
              <p className="text-lg font-semibold text-white">
                {isUploading ? 'Uploading...' : 'Drag and drop your resume'}
              </p>
              <p className="text-sm text-slate-400 mt-2">
                or click to browse (PDF, DOC, DOCX - Max 5MB)
              </p>
            </div>
          </motion.div>
        </label>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <X size={18} />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <motion.div
          className="mt-8 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-lg font-semibold text-white">Uploaded Resumes</h3>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <motion.div
                key={file.id}
                className="glass-card p-4 flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-violet-400" />
                  <div>
                    <p className="text-white font-medium">{file.originalName}</p>
                    <p className="text-sm text-slate-400">
                      {(file.size / 1024).toFixed(2)} KB • {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  className="text-slate-400 hover:text-red-400 transition-colors"
                  onClick={() => {
                    // Add delete functionality
                  }}
                >
                  <X size={20} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ResumeUploadComponent;
