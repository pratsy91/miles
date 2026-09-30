"use client";

import { useEffect, useState } from "react";

function useStoredList<T>(
  load: () => Promise<T[]>,
  read: () => T[] | null,
  subscribe: (listener: () => void) => () => void,
  errorMessage: string,
) {
  const [items, setItems] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    load()
      .then((next) => {
        if (active) {
          setItems(next);
          setError(null);
        }
      })
      .catch(() => {
        if (active) {
          setError(errorMessage);
        }
      });

    return () => {
      active = false;
    };
  }, [attempt, errorMessage, load]);

  useEffect(() => {
    return subscribe(() => {
      setItems(read());
    });
  }, [read, subscribe]);

  function reload() {
    setItems(null);
    setError(null);
    setAttempt((current) => current + 1);
  }

  return {
    items,
    error,
    loading: items === null && error === null,
    reload,
  };
}

export { useStoredList };
