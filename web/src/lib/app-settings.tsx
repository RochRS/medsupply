import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiClient } from "../config/api";

export const DEFAULT_APP_NAME = "MedSupply";

type AppSettingsContextValue = {
  appName: string;
  loading: boolean;
  refresh: () => Promise<void>;
  setAppName: (appName: string) => void;
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [appName, setAppNameState] = useState(DEFAULT_APP_NAME);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const result = (await apiClient("/settings")) as { appName?: string };
      if (result.appName) setAppNameState(result.appName);
    } catch {
      // keep previous/default name if the settings endpoint is unreachable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ appName, loading, refresh, setAppName: setAppNameState }),
    [appName, loading, refresh],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings(): AppSettingsContextValue {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error("useAppSettings must be used within an AppSettingsProvider");
  }
  return ctx;
}
