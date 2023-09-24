import { Route, Routes } from "react-router-dom";
import "./App.css";
import Hero from "./components/Hero/Hero.js";
import Navbar from "./components/Navbar/Navbar.js";
import Repos from "./components/Repos/Repos";
import { createContext } from "react";
import { UserProvider } from "./components/context/UserContext";
import Descr from "./components/DetailDescription/Descr";

export const UserContext = createContext();
function App() {
  return (
    <>
      <UserContext.Provider>
        <UserProvider>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Hero />
                </>
              }
            />
            <Route
              path="repos"
              element={
                <>
                  <Repos />
                </>
              }
            />
            <Route
              path="repos/descr"
              element={
                <>
                  <Descr />
                </>
              }
            />
          </Routes>
        </UserProvider>
      </UserContext.Provider>
    </>
  );
}

export default App;
