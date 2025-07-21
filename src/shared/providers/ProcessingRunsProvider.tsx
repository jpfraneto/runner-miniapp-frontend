import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { RunningSession } from "@/shared/types/running";

interface ProcessingRun {
  id: string;
  castHash: string;
  timestamp: number;
  text: string;
}

interface ProcessingRunsContextType {
  processingRuns: ProcessingRun[];
  addProcessingRun: (run: ProcessingRun) => void;
  removeProcessingRun: (id: string) => void;
  updateProcessingRun: (id: string, runData: RunningSession) => void;
  onRunProcessed?: (runData: RunningSession) => void;
}

const ProcessingRunsContext = createContext<ProcessingRunsContextType | undefined>(undefined);

interface ProcessingRunsProviderProps {
  children: ReactNode;
  onRunProcessed?: (runData: RunningSession) => void;
}

export const ProcessingRunsProvider: React.FC<ProcessingRunsProviderProps> = ({ 
  children, 
  onRunProcessed 
}) => {
  const [processingRuns, setProcessingRuns] = useState<ProcessingRun[]>([]);

  const addProcessingRun = useCallback((run: ProcessingRun) => {
    setProcessingRuns(prev => [...prev, run]);
  }, []);

  const removeProcessingRun = useCallback((id: string) => {
    setProcessingRuns(prev => prev.filter(run => run.id !== id));
  }, []);

  const updateProcessingRun = useCallback((id: string, runData: RunningSession) => {
    // Remove the processing run since it's now completed
    removeProcessingRun(id);
    
    // Call the callback if provided
    if (onRunProcessed) {
      onRunProcessed(runData);
    }
  }, [removeProcessingRun, onRunProcessed]);

  return (
    <ProcessingRunsContext.Provider value={{
      processingRuns,
      addProcessingRun,
      removeProcessingRun,
      updateProcessingRun,
      onRunProcessed
    }}>
      {children}
    </ProcessingRunsContext.Provider>
  );
};

export const useProcessingRuns = () => {
  const context = useContext(ProcessingRunsContext);
  if (context === undefined) {
    throw new Error('useProcessingRuns must be used within a ProcessingRunsProvider');
  }
  return context;
};