/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import Logger from "./logger";
let globalErrorHandler: (errorMessage: string) => void = (message: string) => {
  // toast.error(message);
  Logger.error(message);
};

const setGlobalErrorHandler = (handler: (errorMessage: string) => void) => {
  globalErrorHandler = handler;
};

const triggerGlobalError = (message: string) => {
  const errorMessage = message || "Sorry, An error occurred. Please try again.";
  globalErrorHandler(errorMessage);
};

export { setGlobalErrorHandler, triggerGlobalError };
