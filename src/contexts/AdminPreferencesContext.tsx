import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminPreferences {
  theme: 'dark' | 'light';
  density: 'comfortable' | 'default' | 'compact';
  visibleColumns: Record<string, string[]>;
  defaultSort: Record<string, { column: string; direction: 'asc' | 'desc' }>;
}

interface AdminPreferencesContextType {
  preferences: AdminPreferences;
  updateTheme: (theme: 'dark' | 'light') => void;
  updateDensity: (density: 'comfortable' | 'default' | 'compact') => void;
  updateVisibleColumns: (table: string, columns: string[]) => void;
  updateDefaultSort: (table: string, column: string, direction: 'asc' | 'desc') => void;
}

const AdminPreferencesContext = createContext<AdminPreferencesContextType | undefined>(undefined);

const defaultPreferences: AdminPreferences = {
  theme: 'dark',
  density: 'default',
  visibleColumns: {},
  defaultSort: {},
};

export const AdminPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<AdminPreferences>(() => {
    const saved = localStorage.getItem('admin-preferences');
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('admin-preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updateTheme = (theme: 'dark' | 'light') => {
    setPreferences((prev) => ({ ...prev, theme }));
    document.documentElement.setAttribute('data-admin-theme', theme);
    localStorage.setItem('admin-theme', theme);
  };

  const updateDensity = (density: 'comfortable' | 'default' | 'compact') => {
    setPreferences((prev) => ({ ...prev, density }));
  };

  const updateVisibleColumns = (table: string, columns: string[]) => {
    setPreferences((prev) => ({
      ...prev,
      visibleColumns: {
        ...prev.visibleColumns,
        [table]: columns,
      },
    }));
  };

  const updateDefaultSort = (table: string, column: string, direction: 'asc' | 'desc') => {
    setPreferences((prev) => ({
      ...prev,
      defaultSort: {
        ...prev.defaultSort,
        [table]: { column, direction },
      },
    }));
  };

  return (
    <AdminPreferencesContext.Provider
      value={{
        preferences,
        updateTheme,
        updateDensity,
        updateVisibleColumns,
        updateDefaultSort,
      }}
    >
      {children}
    </AdminPreferencesContext.Provider>
  );
};

export const useAdminPreferences = () => {
  const context = useContext(AdminPreferencesContext);
  if (!context) {
    throw new Error('useAdminPreferences must be used within AdminPreferencesProvider');
  }
  return context;
};
