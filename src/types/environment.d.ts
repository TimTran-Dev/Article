declare global {
  interface Window {
    __ENV__: {
      CLERK_PUBLISHABLE_KEY: string;
      API_URL: string;
      [key: string]: string | undefined;
    };
  }
}

export {};
