/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import CryptoJS from "crypto-js";
import { v4 } from "uuid";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { IGetRequestSignatureParam, IGetRequestSignature, ITheme } from "../../types";

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

enum TENDER_URLS {
  test = "https://stagapi.tender.cash",
  live = "https://secureapi.tender.cash",
  local = "http://localhost:9090",
}

const URL_PATHS = {
  CHAINS: "/system/chains",
  COINS: "/system/coins",
  PAYMENT_INITIATE: "/payment/initiate",
  PAYMENT_VALIDATE: "/payment/validate",
}

const getRequestSignature = ({
  accessId,
  accessSecret,
}: IGetRequestSignatureParam): IGetRequestSignature => {
  const timestamp = Date.now();
  // const requestId = "tender-"+timestamp;
  const requestId = v4();
  const payload = {
      "timeStamp": String(timestamp),
      "requestId": requestId,
      "accessId": accessId,
  };
  const dataStr = JSON.stringify(payload);
  const hmac = CryptoJS.HmacSHA256(dataStr, String(accessSecret));
  const hash = CryptoJS.enc.Base64.stringify(hmac);
  const signature = hash.toString();
  return { signature, timeStamp: String(timestamp), requestId };
};

const applyTheme = (theme: ITheme, hostElement?: HTMLElement) => {
  // Use shadow host element if provided, otherwise find it, or fallback to document root
  // For shadow DOM, we want to set variables on the host element, not document root
  let targetElement: HTMLElement = document.documentElement;
  
  if (hostElement) {
    targetElement = hostElement;
  } else {
    // Try to find the shadow host element
    const shadowHost = document.querySelector('[data-tender-sdk-shadow-host]') as HTMLElement;
    if (shadowHost) {
      targetElement = shadowHost;
    }
  }

  Object.keys(theme).forEach((key) => {
      const value = theme[key as keyof typeof theme] || ""; // Provide a fallback value
      targetElement.style.setProperty(`--tas-${key}`, value);
  });
};

const sleep = (milliseconds: number) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

const sentenceCase = (str: string) => {
  if (typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export {
  cn,
  getRequestSignature,
  applyTheme,
  sleep,
  TENDER_URLS,
  URL_PATHS,
  sentenceCase,
  formatCurrency,
}
