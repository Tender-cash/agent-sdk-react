/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { ConfigContextType } from "../types";
import { TENDER_URLS } from "./utils";
import { triggerGlobalError } from "./error-handler";
import Logger from "./logger";

// A variable to store the Axios instance globally
let axiosInstance: AxiosInstance = axios.create();

// Function to set the Axios instance globally
const setAxiosInstance = (config: ConfigContextType) => {
  axiosInstance.defaults.baseURL = TENDER_URLS[config.env] + "/v1/api/";
  axiosInstance.interceptors.request.use((request) => {
      request.headers["x-access-id"] = config.accessId;
      return request;
  });
};

// Utility function for handling errors
const handleErrorResponse = async (error: AxiosError): Promise<void> => {
	if (error.response) {
		const { status } = error.response;
		const currentPath = window.location.pathname;
    if (!error.config?.headers.toJSON()["hide-notify"]){
      Logger.error("error-response",{ status, currentPath, message: error?.message, stack: error.cause })
      triggerGlobalError(error.message);
    }
	}
	return Promise.reject(error);
};

axiosInstance.interceptors.response.use((response) => response, handleErrorResponse);

// Function to get the Axios instance globally
const getAxiosInstance = (): AxiosInstance => {
    return axiosInstance;
};

export { setAxiosInstance, getAxiosInstance };
