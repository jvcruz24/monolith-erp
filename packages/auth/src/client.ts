import { createAuthClient } from 'better-auth/react';

export const createClient = (baseURL: string) =>
  createAuthClient({
    baseURL,
    fetchOptions: { credentials: 'include' },
  });
