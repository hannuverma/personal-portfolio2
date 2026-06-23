import { createContext, useContext, useState, type ReactNode } from 'react';

type CursorVariant = 'default' | 'expanded' | 'text';

interface CursorContextType {
  variant: CursorVariant;
  text: string;
  setVariant: (variant: CursorVariant, text?: string) => void;
  resetVariant: () => void;
}

const CursorContext = createContext<CursorContextType>({
  variant: 'default',
  text: '',
  setVariant: () => {},
  resetVariant: () => {},
});

export function CursorProvider({ children }: { children: ReactNode }) {
  const [variant, setVariantState] = useState<CursorVariant>('default');
  const [text, setText] = useState('');

  const setVariant = (v: CursorVariant, t: string = '') => {
    setVariantState(v);
    setText(t);
  };

  const resetVariant = () => {
    setVariantState('default');
    setText('');
  };

  return (
    <CursorContext.Provider value={{ variant, text, setVariant, resetVariant }}>
      {children}
    </CursorContext.Provider>
  );
}

export const useCursor = () => useContext(CursorContext);
