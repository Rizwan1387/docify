import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [path, setPath] = useState("");
  const [repo, setRepo] = useState("");

  return (
    <UserContext.Provider
      value={{
        username,
        token,
        path,
        repo,
        setUsername,
        setToken,
        setPath,
        setRepo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
