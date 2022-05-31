import React, { createContext, ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { runVanillaApp } from "./challenge-1-vanilla";
import FunctionalComp from "./challenge-2-ReactFunctionalComp";
import ClassComp from "./challenge-3-ReactClassComp";
import "./index.css";
import { AppLocale } from "./localization";
import { Env } from "./services";

// App settings --------------------------------------------- /

const locale = AppLocale.EnglishUS; // <--- Try changing this to Spanish
const env = Env.Dev;

const useStrictMode = true;
const useMockApi = false;

// Main app props ------------------------------------------- /

export interface MainProps {
  useMockApi?: boolean;
}

// App contexts --------------------------------------------- /

export const LocaleContext = createContext(locale);
export const EnvContext = createContext(env);

// ---------------------------------------------------------- /

runVanillaApp(document, {
  locale,
  env,
  useMockApi,
});

const content: ReactNode = (
  <LocaleContext.Provider value={locale}>
    <EnvContext.Provider value={env}>
      <FunctionalComp useMockApi={useMockApi} />
      <ClassComp useMockApi={useMockApi} />
    </EnvContext.Provider>
  </LocaleContext.Provider>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  useStrictMode ? (
    <React.StrictMode>
      { content }
    </React.StrictMode>
  ) : content
);
