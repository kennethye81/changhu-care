import { createContext, useContext, useState, type FC, type ReactNode } from 'react';

type ViewMode = 'desktop' | 'mobile' | 'elites';

interface ViewState {
  view: ViewMode;
  setView: (v: ViewMode) => void;
}

const ViewContext = createContext<ViewState>({ view: 'desktop', setView: () => {} });

export const useView = () => useContext(ViewContext);

export const ViewProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<ViewMode>('desktop');
  return <ViewContext.Provider value={{ view, setView }}>{children}</ViewContext.Provider>;
};
