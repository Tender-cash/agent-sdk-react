/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Axios } from "axios";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import defaultTheme from "../../styles/default-theme";
import { getAxiosInstance, setAxiosInstance } from "../lib/axios-instance";
import { applyTheme } from "../lib/utils";
import { TenderSpinner } from "../_components";
import { ConfigContextType } from "../types";
import Logger from "../lib/logger";
import { findElementInShadowDOM } from "../../lib/shadow-dom-utils";

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
    
    // Find the shadow host element to apply theme variables to it instead of document root
    // This prevents CSS variables from leaking into the main website
    let shadowHost: HTMLElement | null = null;
    try {
      // Try to find shadow host by traversing from current element (searches shadow DOM)
      const container = findElementInShadowDOM('tender-cash-agent-sdk');
      if (container) {
        const rootNode = container.getRootNode();
        if (rootNode instanceof ShadowRoot) {
          shadowHost = rootNode.host as HTMLElement;
        }
      }
      // Fallback: find by data attribute
      if (!shadowHost) {
        shadowHost = document.querySelector('[data-tender-sdk-shadow-host]') as HTMLElement;
      }
    } catch (e) {
      // If we can't find shadow host, applyTheme will use document root as fallback
    }
    
    applyTheme(selectedTheme, shadowHost || undefined);
    Logger.showLogger(TENDER_DEBUG);
    setTimeout(()=>setLoading(true), 3000);
  }, [config]);

  return (
      <ConfigContext.Provider value={{
        ...config,
        client: getAxiosInstance(),
        CONFIRM_INTERVAL: config.confirmationInterval || DEFAULT_CONFIRM_INTERVAL,
      }}>
        <div className="ta:relative ta:mx-auto ta:flex ta:flex-col ta:gap-2 ta:bg-white ta:rounded-lg sm:ta:rounded-2xl ta:border ta:border-[#EAECF0] ta:w-full ta:max-w-[480px] ta:min-h-[500px] sm:ta:h-[600px] ta:items-start ta:overflow-hidden">
          {!isLoading ? 
          <TenderSpinner />
          : 
            children
          }
        </div>
        <Toaster
            position="top-center"
            gutter={8}
            containerClassName="ta:p-0 ta:m-0 ta:z-[999999] sm:ta:top-right"
        />
      </ConfigContext.Provider>
  );
};

export { useConfig, ConfigProvider };
