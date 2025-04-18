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
  test = "http://localhost:9090",
  // test = "https://stagapi.tender.cash",
  live = "https://secureapi.tender.cash",
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

const applyTheme = (theme: ITheme) => {
  const root = document.documentElement;

  Object.keys(theme).forEach((key) => {
      const value = theme[key as keyof typeof theme] || ""; // Provide a fallback value
      root.style.setProperty(`--tas-${key}`, value);
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

export {
  cn,
  getRequestSignature,
  applyTheme,
  sleep,
  TENDER_URLS,
  URL_PATHS,
  sentenceCase,
}
