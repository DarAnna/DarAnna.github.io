import React, { createContext, useContext, useState, ReactNode } from 'react';

type AppState = {
  currentStage: number;
  puzzle1Completed: boolean;
  puzzle2Completed: boolean;
  cardOpened: boolean;
  userName: string;
};

type AppContextType = {
  state: AppState;
  advanceStage: () => void;
  completePuzzle1: () => void;
  completePuzzle2: () => void;
  openCard: () => void;
  setUserName: (name: string) => void;
};

const defaultState: AppState = {
  currentStage: 0,
  puzzle1Completed: false,
  puzzle2Completed: false,
  cardOpened: false,
  userName: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(defaultState);

  const advanceStage = () => {
    setState(prev => ({ ...prev, currentStage: prev.currentStage + 1 }));
  };

  const completePuzzle1 = () => {
    setState(prev => ({ 
      ...prev, 
      puzzle1Completed: true,
      currentStage: prev.currentStage + 1
    }));
  };

  const completePuzzle2 = () => {
    setState(prev => ({ 
      ...prev, 
      puzzle2Completed: true,
      currentStage: prev.currentStage + 1 
    }));
  };

  const openCard = () => {
    setState(prev => ({ ...prev, cardOpened: true }));
  };

  const setUserName = (name: string) => {
    setState(prev => ({ ...prev, userName: name }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        advanceStage,
        completePuzzle1,
        completePuzzle2,
        openCard,
        setUserName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 