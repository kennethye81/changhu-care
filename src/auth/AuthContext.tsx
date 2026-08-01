import { createContext, useContext, useState, useCallback, type FC, type ReactNode } from 'react';
import type { User } from './types';
import { MOCK_USERS, ROLE_NAV, ROLE_SIDE_NAV } from './types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (account: string, password: string, institutionId: string) => { success: boolean; error?: string };
  logout: () => void;
  switchUser: (account: string) => boolean;
  hasAccess: (feature: string, navType: 'top' | 'side') => boolean;
}

const AuthContext = createContext<AuthState>(null!);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({ id: 'N002', name: '刘敏', role: 'nurse', avatar: 'LM', institutionId: 'CN-INST-002', account: 'liu.min' });

  const login = useCallback((account: string, password: string, institutionId: string) => {
    if (!institutionId.trim()) return { success: false, error: 'Institution ID is required' };
    if (!account.trim()) return { success: false, error: 'Account is required' };
    if (!password.trim()) return { success: false, error: 'Password is required' };

    const entry = MOCK_USERS[account];
    if (!entry) return { success: false, error: 'Account not found' };
    if (entry.password !== password) return { success: false, error: 'Invalid password' };
    if (entry.user.institutionId !== institutionId) return { success: false, error: 'No access to this institution' };

    setUser(entry.user);
    return { success: true };
  }, []);

  const logout = useCallback(() => {}, []);

  const switchUser = useCallback((account: string) => {
    const entry = MOCK_USERS[account];
    if (entry) { setUser(entry.user); return true; }
    return false;
  }, []);

  const hasAccess = useCallback((feature: string, navType: 'top' | 'side') => {
    if (!user) return false;
    const list = navType === 'top' ? ROLE_NAV[user.role] : ROLE_SIDE_NAV[user.role];
    return list.includes(feature);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: true, login, logout, switchUser, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
};
