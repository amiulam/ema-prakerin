"use client";

import { createContext, useContext } from "react";
import { Session, User } from "lucia";

interface SessionProviderProps {
  user: User | null;
  session: Session | null;
}

const SessionContext = createContext<SessionProviderProps>(
  {} as SessionProviderProps,
);

export const SessionContextProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: SessionProviderProps;
}) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => {
  const sessionContext = useContext(SessionContext);

  if (!sessionContext) {
    throw new Error("useSession must be used within a SessionContextProvider");
  }

  return sessionContext;
};
