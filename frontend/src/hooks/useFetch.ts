import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { AxiosError } from "axios";

interface UseFetchOptions {
  immediate?: boolean; // Se deve executar imediatamente
  onSuccess?: (data: any) => void;
  onError?: (error: AxiosError) => void;
}

interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  execute: () => Promise<void>;
  reset: () => void;
}

export function useFetch<T = any>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  const { immediate = false, onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<AxiosError | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<T>(url);
      setData(response.data);
      onSuccess?.(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError);
      onError?.(axiosError);
    } finally {
      setLoading(false);
    }
  }, [url, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

