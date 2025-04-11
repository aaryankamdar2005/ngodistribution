import { createContext, useState } from "react";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  return (
    <UserContext.Provider value={{ user, setUser, notifications, setNotifications }}>
      {children}
    </UserContext.Provider>
  );
}