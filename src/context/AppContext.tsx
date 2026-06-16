import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SavedOutput {
  id: string;
  type: 'resume' | 'coverletter' | 'ats' | 'jdmatch' | 'interview';
  title: string;
  content: string;
  createdAt: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  savedOutputs: SavedOutput[];
  saveOutput: (output: Omit<SavedOutput, 'id' | 'createdAt'>) => void;
  deleteOutput: (id: string) => void;
  toasts: Toast[];
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [savedOutputs, setSavedOutputs] = useState<SavedOutput[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load saved outputs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('jobreach_outputs');
    if (saved) {
      try {
        setSavedOutputs(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved outputs:', e);
      }
    }
  }, []);

  // Save to localStorage whenever savedOutputs changes
  useEffect(() => {
    localStorage.setItem('jobreach_outputs', JSON.stringify(savedOutputs));
  }, [savedOutputs]);

  const saveOutput = (
    output: Omit<SavedOutput, 'id' | 'createdAt'>
  ) => {
    const newOutput: SavedOutput = {
      ...output,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setSavedOutputs((prev) => [newOutput, ...prev]);
    showToast('Saved to your library!', 'success');
  };

  const deleteOutput = (id: string) => {
    setSavedOutputs((prev) => prev.filter((output) => output.id !== id));
    showToast('Output deleted', 'info');
  };

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        savedOutputs,
        saveOutput,
        deleteOutput,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
