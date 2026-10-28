import { createAuthClient } from 'better-auth/client';

export const createClient = (baseURL: string) => createAuthClient({ baseURL });
