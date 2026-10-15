import React, { createContext, useContext, useEffect, useState } from 'react';
import { load, save } from './storage';

type Ctx = { passport: string | null; setPassport: (c: string) => void };
const PassportCtx = createContext<Ctx>({ passport: null, setPassport: () => {} });
const KEY = 'visara:passport';

export function PassportProvider({ children }: { children: React.ReactNode }) {
  const [passport, setP] = useState<string | null>(null);
  useEffect(() => {
    load<string | null>(KEY, null).then(setP);
  }, []);
  const setPassport = (c: string) => {
    setP(c);
    save(KEY, c);
  };
  return <PassportCtx.Provider value={{ passport, setPassport }}>{children}</PassportCtx.Provider>;
}

export const usePassport = () => useContext(PassportCtx);
