/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Axios } from "axios";
import "react-loading-skeleton/dist/skeleton.css";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import defaultTheme from "../../styles/default-theme";
import { getAxiosInstance, setAxiosInstance } from "../lib/axios-instance";
import "../../styles/index.scss";
import { applyTheme } from "../lib/utils";
import { TenderSpinner } from "../_components";
import { ConfigContextType } from "../types";
import Logger from "../lib/logger";

const DEFAULT_CONFIRM_INTERVAL = 15000;
const TENDER_DEBUG = true;

const ConfigContext = createContext<ConfigContextType & { client?: Axios, CONFIRM_INTERVAL: number } | undefined>(undefined);

const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
      throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};

interface ConfigProviderProps {
  config: ConfigContextType;
  children: ReactNode;
}

const ConfigProvider: React.FC<ConfigProviderProps> = ({
    config,
    children,
}) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setAxiosInstance(config); // Set the Axios instance globally
    const selectedTheme = {...defaultTheme};
    applyTheme(selectedTheme);
    Logger.showLogger(TENDER_DEBUG);
    setTimeout(()=>setLoading(true), 3000);
  }, [config]);

  return (
      <ConfigContext.Provider value={{
        ...config,
        client: getAxiosInstance(),
        CONFIRM_INTERVAL: config.confirmationInterval || DEFAULT_CONFIRM_INTERVAL,
      }}>
        <div className="ta-mx-auto ta-flex ta-w-full ta-flex-col ta-gap-6 ta-bg-white ta-rounded-2xl ta-border ta-gap-4 sm:ta-w-[600px] ta-items-start ta-w-full">
          {!isLoading ? 
          <TenderSpinner />
          : 
            children
          }
        </div>
        <Toaster
            position="top-right"
            gutter={8}
            containerClassName="!pam-z-[999999]"
        />
      </ConfigContext.Provider>
  );
};

export { useConfig, ConfigProvider };
