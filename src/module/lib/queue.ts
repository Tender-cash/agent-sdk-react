import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getAxiosInstance } from "./axios-instance";
import { QueueItem } from "../types";
import Logger from "./logger";

// API-Request-Queue
class ApiRequestQueue {
  private queue: QueueItem[] = [];
  private processing = false;
  private isCleared = false;
  private axios: AxiosInstance;

  constructor(){
    this.axios = getAxiosInstance();
  }

  // processQueue
  private async processQueue(): Promise<void> {
    if (this.processing || this.isCleared || this.queue.length === 0) return;

    this.processing = true;
    

    while (this.queue.length > 0) {
      const { config, resolve, reject, retries } = this.queue.shift()!;
      try {
        const response = await this.sendRequest(config, retries);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    }

    this.processing = false;
  }

  // sendRequest
  private async sendRequest(config: AxiosRequestConfig<{abortController?:AbortController}>, retries: number = 3): Promise<AxiosResponse> {
    let attempt = 0;
    let delay = 1000; // Start with 1 second delay

    while (attempt < retries) {
      try {
        Logger.info(`API Request: Attempt ${attempt + 1}`);
        const response = await this.axios(config);
        return response;
      } catch (error: any) {
        attempt++;
        Logger.warn(`Request failed: ${error.message}. Retrying in ${delay}ms...`);

        if (attempt >= retries) throw new Error("Request failed after maximum retries.");

        await new Promise((res) => setTimeout(res, delay));
        delay *= 2; // Exponential backoff
      }
    }

    throw new Error("Request failed after retries.");
  }

  // addToQueue
  public addToQueue<T = any>(config: AxiosRequestConfig, customHeaders: Record<string, string> = {}, retryCount = 3): Promise<AxiosResponse<T>> {
    return new Promise((resolve, reject) => {
      const id = `req-${Date.now()}`; // Unique request ID
      const controller = new AbortController();
      const requestConfig: AxiosRequestConfig= {
        ...config,
        headers: {
          ...config.headers,
          ...customHeaders,
          "X-Request-ID": id,
        },
        signal: controller.signal,
      };
      Logger.info("adding-to-queue", { ...customHeaders, id, url:config.url, retryCount });
      this.queue.push({ id, config:requestConfig, controller, resolve, reject, retries: retryCount });
      this.processQueue();
    });
  }

  // CancelAllRequest
  public cancelRequest(requestId: string): void {
    const index = this.queue.findIndex((item) => item.id === requestId);
    if (index !== -1) {
      Logger.info(`Canceling request: ${requestId}`);
      this.queue[index]
      this.queue.splice(index, 1);
    } else {
      Logger.warn(`Request with ID ${requestId} not found in the queue.`);
    }
  }

  // ClearPendingQueues
  public clearQueue(){
    Logger.info("Clearing all requests in the queue...");
    this.queue.forEach((item) => this.cancelRequest(item.id));
    this.queue = [];
    this.processing = false;
    this.isCleared = true;
  }
}

export default ApiRequestQueue;
