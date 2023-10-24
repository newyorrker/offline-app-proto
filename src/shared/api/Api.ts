import axios from 'axios';
import type { AxiosInstance } from 'axios';

enum Platform {
  iOS = 'iOS',
  Android = 'Android',
  Web = 'Web',
}

interface Session {
  userId?: number;
  sessionId: string;
  appPlatform?: Platform;
  backendUrl?: string;
  baseUrl?: string;
  projectName?: string;
  userProfile: {
    groupIds: string[];
  };
}

export type CorrectSession = Omit<Session, 'backendUrl' | 'baseUrl' | 'projectName'> &
  (
    | (Pick<Session, 'backendUrl'> & Required<Pick<Session, 'baseUrl' | 'projectName'>>)
    | (Required<Pick<Session, 'backendUrl'>> & Pick<Session, 'baseUrl' | 'projectName'>)
  );

export {type AxiosInstance}

const refreshSession = () => {
  if (window.webkit != undefined) {
    if (window.webkit.messageHandlers.session != undefined) {
      window.webkit.messageHandlers.session.postMessage('refresh');
      return;
    }
  }
  if (window.session != undefined) {
    window.session.postMessage('refresh');
    return;
  }
  throw Error('Refresh session exception');
};

export default class Api {
  private client: AxiosInstance;
  subscribers: any = [];
  isTokenUpdating = false;
  private static instance: Api;

  private constructor(public readonly name: string, timeout: number = 20000) {
    this.client = axios.create({
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          const originalRequest = error.config;
          const retryOriginalRequest = new Promise((resolve) => {
            this.addSubscriber((newToken: string) => {
              originalRequest.headers['X-Appercode-Session-Token'] = newToken;
              resolve(this.client(originalRequest));
            });
          });

          if (!this.isTokenUpdating) {
            this.isTokenUpdating = true;
            refreshSession();
          }
          return retryOriginalRequest;
        } else {
          console.error('Не удалось выполнить обновление');
        }
        return Promise.reject(error);
      },
    );
  }

  static getInstance(timeout: number = 60000) {
    if (!Api.instance) {
      Api.instance = new Api('Api' + Math.random(), timeout);
    }

    return Api.instance;
  }

  getClient() {
    return this.client;
  }

  setSession(newSession: CorrectSession): void {
    this.client.defaults.baseURL = newSession.backendUrl || newSession.baseUrl! + newSession.projectName;
    this.client.defaults.headers.common['X-Appercode-Session-Token'] = newSession.sessionId;

    this.onTokenFetched(newSession.sessionId);
    this.isTokenUpdating = false;
  }

  addSubscriber(callback: any) {
    this.subscribers.push(callback);
  }

  onTokenFetched(newToken: string) {
    this.subscribers.forEach((callback: any) => callback(newToken));
    this.subscribers = [];
  }
}
